import {Router, Request, Response} from 'express'
import {AxiosError, AxiosResponse} from 'axios'
import Constants from '../downstream-services/Constants';
import YouTubeAxiosConfig from '../downstream-services/YouTubeAxiosConfig';
import moize from 'moize'


export default class YouTubeChannelActivity
{
	/**
	 * Function definition that uses memoization with expiration policy to prevent exceeding quota limits Google uses.
	 */
	static YouTubeRequestMemoized = moize((channelId: string) => {
		return YouTubeAxiosConfig.BASE_CONFIG
		.get('/activities'
			, {
				params: {
					channelId: channelId
				}
			}
		)
	}, { maxAge: 1000 * 60 * 8, updateExpire: false })


	/**
	 * Function that updates a Router object to expose an endpoint that clients can use to get information about YouTube Video Uploads.
	 * There will be checks to prevent unwanted users from using this API to prevent Quota Limit errors.
	 * YouTube API output is cleaned up and only the most useful info is returned to client.
	 * @param router object that will be used to expose functionality.
	 */
	static retrieveYTChannelUploads = (router: Router) =>
	{
		router.post('/yt/channel/activity', (req: Request, res: Response) =>
		{
			const channelId: string = req.body.channelId

			// prevent malicious use of API
			if ( !Constants.VALID_YOUTUBE_CHANNEL_IDS.includes(channelId) )
			{
				res.status(400)
				res.json({errorDescription: 'This API cannot use provided channelId'})
			}


			YouTubeChannelActivity.YouTubeRequestMemoized(channelId)
			.then((ytResponse: AxiosResponse) => {
				const videoIds = []

				const formattedYtResponse = ytResponse.data.items.map((item: any) => {
					if (item.snippet.type === 'upload') {
						videoIds.push(item.contentDetails.upload.videoId)
						return {
							id: item.contentDetails.upload.videoId
							, title: item.snippet.title
							, description: item.snippet.description
							, publishedAt: item.snippet.publishedAt
							, thumbnailUrl: item.snippet.thumbnails.high.url
							, url: `https://www.youtube.com/watch?v=${item.contentDetails.upload.videoId}`
						}
					}
				})


				res.status(200)
				res.json({'total': formattedYtResponse.length, 'videos': formattedYtResponse})
			})
			.catch((error: AxiosError) => {
				console.error(`YouTube Data API (v3) returned with error: ${error.code}`)

				let description = 'YouTube API call encountered error.'
				if (error.response.status === 403)	description = 'Request has incorrect API key or no API key.'

				res.status(500)
				res.json({youtubeApiStatus: error.response.status, description: description})
			})
		})
	}

	static initRouter = (): Router =>
	{
		const router = Router()

		YouTubeChannelActivity.retrieveYTChannelUploads(router)
		return router
	}


	static router: Router = YouTubeChannelActivity.initRouter()
}