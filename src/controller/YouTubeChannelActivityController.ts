
import { Request, Response } from 'express'
import { AxiosError, AxiosResponse } from 'axios'
import Constants from '../constants/Constants'
import YouTubeAxiosConfig from '../service/YouTubeAxiosConfig'
import moize from 'moize'
import HeartAPIError from '../error/HeartAPIError'
import YouTubeUploadsResponse, { FormattedUploadResponse } from '../model/YouTubeUploadsResponse'

type YouTubeAPIResponse = {
	kind: string
	etag: string
	id: string
	snippet: {
		publishedAt: string;
		channelId: string,
		title: string,
		description: string,
		thumbnails: {
			default: {
				url: string
				width: string
				height: string
			}
			medium: {
				url: string
				width: string
				height: string
			}
			high: {
				url: string
				width: string
				height: string
			}
			standard: {
				url: string
				width: string
				height: string
			}
			maxres: {
				url: string
				width: string
				height: string
			}
		}
		channelTitle: string
		type: string
	}
	contentDetails: {
		upload: {
			videoId: string
		}
	}
}


/**
 * Exposes an endpoint that clients can use to get information about YouTube Video Uploads.
 * There will be checks to prevent unwanted users from using this API to prevent Quota Limit errors.
 * YouTube API output is cleaned up and only the most useful info is returned to client.
 * @param router object that will be used to expose functionality.
*/
export default function YouTubeChannelActivityController() {
	return async (req: Request, res: Response) => {
		let status: number
		let json: YouTubeUploadsResponse | HeartAPIError

		if (req.query == null || req.query.key == null || req.query.channelId == null) {
			status = 400
			json = new HeartAPIError('Missing required query params.', status)
		} else if (req.query.key !== Constants.HEART_API_KEY) {
			status = 401
			json = new HeartAPIError('API key is incorrect.', status)
		} else if((!Constants.VALID_YOUTUBE_CHANNEL_IDS.includes(req.query.channelId.toString()))) {	// prevent malicious use of API
			status = 401
			json = new HeartAPIError('This API cannot use provided channelId. Only certain Id\'s are permitted.', status)
		}
		else {
			await memoizedYouTubeRequest(req.query.channelId.toString())
				.then((ytResponse: AxiosResponse) => {
					const videoIds: string[] = []

					const formattedYtResponse: FormattedUploadResponse[] = ytResponse.data.items.map((youTubeVidInfo: YouTubeAPIResponse): FormattedUploadResponse | void => {
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
					})

					status = 200
					json = new YouTubeUploadsResponse(formattedYtResponse, formattedYtResponse.length)

				})
				.catch((error: AxiosError) => YouTubeAxiosConfig.youtubeAPIErrorCallback2(error))
		}

		res.status(status!)
		res.json(json!)
		res.end()
	}
}



/**
 * Function definition that uses memoization with expiration policy to prevent exceeding quota limits Google uses.
*/
const memoizedYouTubeRequest = moize((channelId: string) => {
	return YouTubeAxiosConfig.YOUTUBE_UPLOADS_AXIOS_BASE_CONFIG
		.get('/activities'	// documentation for endpoint -> https://developers.google.com/youtube/v3/docs/activities/list
			, {
				params: {
					channelId: channelId
				}
			}
		)
}, { maxAge: 1000 * 60 * 15, updateExpire: false })