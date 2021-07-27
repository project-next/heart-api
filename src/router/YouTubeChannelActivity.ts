import { Router, Request, Response } from 'express'
import { AxiosError, AxiosResponse } from 'axios'
import Constants from '../service/Constants';
import YouTubeAxiosConfig from '../service/YouTubeAxiosConfig';
import moize from 'moize'
import Endpoint from './Endpoint';
import HeartAPIError from '../error/HeartAPIError'
import YouTubeUploadsResponse, { FormattedUploadResponse } from './YouTubeUploadsResponse';


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

export default class YouTubeChannelActivity implements Endpoint {

	public readonly router = Router()


	constructor() {
		this.get()
	}


	/**
	 * Function that updates a Router object to expose an endpoint that clients can use to get information about YouTube Video Uploads.
	 * There will be checks to prevent unwanted users from using this API to prevent Quota Limit errors.
	 * YouTube API output is cleaned up and only the most useful info is returned to client.
	 * @param router object that will be used to expose functionality.
	 */
	get(): void {
		this.router.get('/yt/channel/uploads', (req: Request, res: Response) => {
			if (req.query.channelId === undefined || req.query.channelId === null) {
				const status = 422

				res.status(status)
				res.json(new HeartAPIError('Empty or null channelId.', status))

				res.end()
				return
			}

			let channelId = req.query.channelId.toString()
			if (!Constants.VALID_YOUTUBE_CHANNEL_IDS.includes(channelId))	// prevent malicious use of API
			{
				const status = 400

				res.status(status)
				res.json(new HeartAPIError('This API cannot use provided channelId. Only certain Id\'s are permitted.', status))

				res.end()
				return
			}


			this.memoizedYouTubeRequest(channelId)
				.then((ytResponse: AxiosResponse) => {
					const videoIds: string[] = []

					const formattedYtResponse: [FormattedUploadResponse] = ytResponse.data.items.map((youTubeVidInfo: YouTubeAPIResponse) => {
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


					res.status(200)
					res.json(new YouTubeUploadsResponse(formattedYtResponse, formattedYtResponse.length))
					res.end()
				})
				.catch((error: AxiosError) => YouTubeAxiosConfig.YOUTUBE_API_ERROR_CALLBACK(error, res))
		})
	}


	post(): void {
		throw new Error('Method not implemented.');
	}


	/**
	 * Function definition that uses memoization with expiration policy to prevent exceeding quota limits Google uses.
	 */
	private memoizedYouTubeRequest = moize((channelId: string) => {
		return YouTubeAxiosConfig.YOUTUBE_UPLOADS_AXIOS_BASE_CONFIG
			.get('/activities'	// documentation for endpoint -> https://developers.google.com/youtube/v3/docs/activities/list
				, {
					params: {
						channelId: channelId
					}
				}
			)
	}, { maxAge: 1000 * 60 * 15, updateExpire: false })

}