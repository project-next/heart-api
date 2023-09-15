import { NextFunction, Request, Response } from 'express'
import moize from 'moize'
import { AxiosError, AxiosResponse } from 'axios'
import Constants from '../helper/Constants.js'
import YouTubeAxiosConfig from '../config/YouTubeAxiosConfig.js'
import HeartAPIError from '../error/HeartAPIError.js'
import { YouTubeVideo, YouTubeVideoUploadsEndpointResponse } from '../types/YouTubeAPIVideoTypes'
import { YouTubeUploadsResponse, FormattedUploadResponse } from '../types/HeartAPIYouTubeTypes'
import YouTubeAPIError from '../error/YouTubeAPIError.js'
import { YouTubeAPIChannelInfoResponse } from '../types/YouTubeAPIChannelInfo.js'

/**
 * Exposes an endpoint that clients can use to get information about YouTube Video Uploads.
 * There will be checks to prevent unwanted users from using this API to prevent Quota Limit errors.
 * YouTube API output is cleaned up and only the most useful info is returned to client.
 * @param router object that will be used to expose functionality.
 */
export default async function youTubeChannelActivityControllerCB(req: Request, res: Response, next: NextFunction) {
	const CHANNEL_ID = req.query?.channelId

	if (CHANNEL_ID == null || typeof CHANNEL_ID !== 'string') {
		next(new HeartAPIError(Constants.MISSING_REQUIRED_PARAM_MESSAGE, 400))
		return
	} else if (!Constants.VALID_YOUTUBE_CHANNEL_IDS.includes(CHANNEL_ID.toString())) {
		// prevent malicious use of API
		next(new HeartAPIError("This API cannot use provided channelId. Only certain Id's are permitted.", 401))
		return
	}

	const uploadsPlaylistIdRes = await memoizedUploadsPlaylistId(CHANNEL_ID.toString())
	if (uploadsPlaylistIdRes instanceof HeartAPIError) {
		next(uploadsPlaylistIdRes)
		return
	}
	const json = await memoizedYouTubeRequest(uploadsPlaylistIdRes)
	if (json instanceof HeartAPIError) {
		next(json)
		return
	}

	res.status(200).json(json)
}

/**
 * Function definition that uses memoization with expiration policy to prevent exceeding quota limits Google uses.
 * This will fetch the playlist ID for a channels default playlist where all uploads reside.
 */
const memoizedUploadsPlaylistId = moize(
	async (channelId: string): Promise<string | HeartAPIError> => {
		console.log(`Getting upload playlist ID for channel with ID ${channelId}`)
		return await YouTubeAxiosConfig.YOUTUBE_CHANNEL_INFO_AXIOS_CONFIG.get('', {
			params: {
				id: channelId,
			},
		})
			.then((ytResponse: AxiosResponse<YouTubeAPIChannelInfoResponse>) => {
				if (ytResponse.data.items.length < 1) {
					console.error('Channel info request did not return correct data')
					return new HeartAPIError('Could not determine "uploads" playlist ID.', 500)
				}
				const UPLOADS_PLAYLIST_ID = ytResponse.data?.items[0]?.contentDetails?.relatedPlaylists?.uploads
				return UPLOADS_PLAYLIST_ID ?? new HeartAPIError('Could not determine "uploads" playlist ID.', 500)
			})
			.catch((error: AxiosError) => {
				console.error(`Error fetching channel info for channel with ID ${channelId}`)
				return new YouTubeAPIError(error).convertYTErrorToHeartAPIError()
			})
	},
	{ maxAge: 1000 * 60 * 60 * 24 }
)

/**
 * Function definition that uses memoization with expiration policy to prevent exceeding quota limits Google uses.
 * This will fetch recent uploads using the default "uploads" playlist of a channel. Caller should know this uploads playlist ID before calling the method.
 */
const memoizedYouTubeRequest = moize(
	async (UPLOADS_PLAYLIST_ID: string): Promise<YouTubeUploadsResponse | HeartAPIError> => {
		return await YouTubeAxiosConfig.YOUTUBE_PLAYLIST_CONTENTS_AXIOS_CONFIG.get('', {
			params: {
				playlistId: UPLOADS_PLAYLIST_ID,
			},
		})
			.then((ytResponse: AxiosResponse<YouTubeVideoUploadsEndpointResponse>) => {
				const formattedYtResponse: FormattedUploadResponse[] = ytResponse.data.items.map((youTubeVidInfo: YouTubeVideo): FormattedUploadResponse => {
					const videoId = youTubeVidInfo.snippet.resourceId.videoId
					const thumbnail = youTubeVidInfo.snippet.thumbnails.high?.url ?? '' // if undefined, default to empty string

					return {
						id: videoId,
						title: youTubeVidInfo.snippet.title,
						description: youTubeVidInfo.snippet.description,
						publishedAt: youTubeVidInfo.snippet.publishedAt,
						thumbnailUrl: thumbnail,
						url: `https://www.youtube.com/watch?v=${videoId}`,
					}
				})

				return { videos: formattedYtResponse, total: formattedYtResponse.length }
			})
			.catch((error: AxiosError) => {
				return new YouTubeAPIError(error).convertYTErrorToHeartAPIError()
			})
	},
	{ maxAge: 1000 * 60 * 10 }
)
