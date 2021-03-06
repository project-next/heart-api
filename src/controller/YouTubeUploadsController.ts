import { NextFunction, Request, Response } from 'express'
import { AxiosError, AxiosResponse } from 'axios'
import Constants from '@helper/Constants'
import YouTubeAxiosConfig from '@config/YouTubeAxiosConfig'
import moize from 'moize'
import HeartAPIError from '@error/HeartAPIError'
import { YouTubeVideo, YouTubeVideoUploadsEndpointResponse } from '../types/YouTubeAPIVideoTypes'
import { YouTubeUploadsResponse, FormattedUploadResponse } from '../types/HeartAPIYouTubeTypes'
import YouTubeAPIError from '@error/YouTubeAPIError'


/**
 * Exposes an endpoint that clients can use to get information about YouTube Video Uploads.
 * There will be checks to prevent unwanted users from using this API to prevent Quota Limit errors.
 * YouTube API output is cleaned up and only the most useful info is returned to client.
 * @param router object that will be used to expose functionality.
*/
export default async function youTubeChannelActivityControllerCB(req: Request, res: Response, next: NextFunction) {
	let json: YouTubeUploadsResponse | HeartAPIError

	if (req.query?.channelId == null) {
		next(new HeartAPIError(Constants.MISSING_REQUIRED_PARAM_MESSAGE, 400))
	} else if((!Constants.VALID_YOUTUBE_CHANNEL_IDS.includes(req.query.channelId.toString()))) {	// prevent malicious use of API
		next(new HeartAPIError('This API cannot use provided channelId. Only certain Id\'s are permitted.', 401))
	}
	else {
		json = await memoizedYouTubeRequest(req.query.channelId.toString())

		if (json instanceof HeartAPIError) {
			next(json)
		} else {
			res
				.status(200)
				.json(json)
		}
	}
}


/**
 * Function definition that uses memoization with expiration policy to prevent exceeding quota limits Google uses.
*/
const memoizedYouTubeRequest = moize(async (channelId: string): Promise<YouTubeUploadsResponse | HeartAPIError> => {
	let json: YouTubeUploadsResponse | HeartAPIError

	await YouTubeAxiosConfig.YOUTUBE_UPLOADS_AXIOS_BASE_CONFIG
		.get('', {
				params: {
					channelId: channelId
				}
			}
		)
		.then((ytResponse: AxiosResponse<YouTubeVideoUploadsEndpointResponse>) => {
			const videoIds: string[] = []

			const formattedYtResponse: FormattedUploadResponse[] = ytResponse.data.items.map((youTubeVidInfo: YouTubeVideo): FormattedUploadResponse | void => {
				if (youTubeVidInfo.snippet.type === 'upload') {
					const videoId = youTubeVidInfo.contentDetails.upload.videoId.toString()
					videoIds.push(videoId)

					return {
						id: videoId
						, title: youTubeVidInfo.snippet.title
						, description: youTubeVidInfo.snippet.description
						, publishedAt: youTubeVidInfo.snippet.publishedAt
						, thumbnailUrl: youTubeVidInfo.snippet.thumbnails.high.url
						, url: `https://www.youtube.com/watch?v=${videoId}`
					}
				}
			}) as FormattedUploadResponse[]
			json = {videos: formattedYtResponse, total: formattedYtResponse.length}

		})
		.catch((error: AxiosError) => json = new YouTubeAPIError(error).convertYTErrorToHeartAPIError())

		return json!
}, { maxAge: 1000 * 60 * 15, updateExpire: false })