import { NextFunction, Request, Response } from 'express'
import moize from 'moize'
import { AxiosResponse } from 'axios'
import Constants from '../helper/Constants.js'
import YouTubeAxiosConfig from '../config/YouTubeAxiosConfig.js'
import HeartAPIError from '../error/HeartAPIError.js'
import { YouTubeUploadsResponse, FormattedUploadResponse } from '../types/YouTubeDataMapping.js'
import { YouTubeAPIChannelInfoResponse } from '../types/YouTubeAPIChannelInfo.js'
import { YouTubeVideo, YouTubeVideoUploadsEndpointResponse } from '../types/YouTubeAPIVideoTypes.js'

type PlaylistContent = { nextPageToken: string | undefined; vidsFromRequest: FormattedUploadResponse[] }

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

	try {
		const uploadsPlaylistId = await memoizedUploadsPlaylistId(CHANNEL_ID.toString())

		let playlistContent: PlaylistContent = { nextPageToken: undefined, vidsFromRequest: [] }
		let formattedYTVids: FormattedUploadResponse[] = []

		do {
			playlistContent = await memoizedPlaylistContentRequest(uploadsPlaylistId, playlistContent.nextPageToken)
			formattedYTVids.push(...playlistContent.vidsFromRequest.filter((vid) => vid.title?.toLocaleLowerCase().indexOf('#shorts') === -1)) // don't send back shorts
		} while (playlistContent.nextPageToken && formattedYTVids.length <= 10)

		formattedYTVids = formattedYTVids.slice(0, 10)
		res.status(200).json({ videos: formattedYTVids, total: formattedYTVids.length } as YouTubeUploadsResponse)
	} catch (err) {
		console.error('Error building uploads output')
		next(err)
		return
	}
}

/**
 * Function definition that uses memoization with expiration policy to prevent exceeding quota limits Google uses.
 * This will fetch the playlist ID for a channels default playlist where all uploads reside.
 */
const memoizedUploadsPlaylistId = moize(
	async (channelId: string): Promise<string> => {
		console.log(`Getting upload playlist ID for channel with ID ${channelId}`)
		return await YouTubeAxiosConfig.YOUTUBE_CHANNEL_INFO_AXIOS_CONFIG.get('', {
			params: {
				id: channelId,
			},
		})
			.then((ytResponse: AxiosResponse<YouTubeAPIChannelInfoResponse>) => {
				if (ytResponse.data.items.length < 1) {
					console.error('Channel info request did not return correct data -  cannot extract default uploads playlist ID')
					throw new HeartAPIError('Could not determine "uploads" playlist ID.', 500)
				}
				const UPLOADS_PLAYLIST_ID = ytResponse.data?.items[0]?.contentDetails?.relatedPlaylists?.uploads
				return UPLOADS_PLAYLIST_ID ?? new HeartAPIError('Could not determine "uploads" playlist ID.', 500)
			})
			.catch(YouTubeAxiosConfig.handleYTRequestError)
	},
	{ maxAge: 1000 * 60 * 60 * 24, maxSize: 5 }
)

/**
 * Function definition that uses memoization with expiration policy to prevent exceeding quota limits Google uses.
 * This will fetch recent uploads using the default "uploads" playlist of a channel. Caller should know this uploads playlist ID before calling the method.
 */
const memoizedPlaylistContentRequest = moize(
	async (playlistId: string, pageToken: string | undefined): Promise<PlaylistContent> => {
		console.log(`Getting playlist contents for playlist w/ ID ${playlistId} and pageToken ${pageToken}`)

		const params = pageToken === undefined ? { playlistId: playlistId } : { playlistId: playlistId, pageToken: pageToken }
		return await YouTubeAxiosConfig.YOUTUBE_PLAYLIST_CONTENTS_AXIOS_CONFIG.get('', {
			params: params,
		})
			.then((ytResponse: AxiosResponse<YouTubeVideoUploadsEndpointResponse>) => {
				return { vidsFromRequest: ytResponse.data.items.map(transformYouTubeVidOutput), nextPageToken: ytResponse.data.nextPageToken }
			})
			.catch(YouTubeAxiosConfig.handleYTRequestError)
	},
	{ maxAge: 1000 * 60 * 10, isPromise: true, isDeepEqual: true, maxSize: 30 }
)

/**
 * Creates a FormattedUploadResponse object using information from YouTube response: YouTubeVideo
 * @param youTubeVidInfo output from YouTube
 * @returns new object containing info from YouTube
 */
const transformYouTubeVidOutput = (youTubeVidInfo: YouTubeVideo): FormattedUploadResponse => {
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
}
