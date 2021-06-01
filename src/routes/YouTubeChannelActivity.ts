import {Router, Request, Response} from 'express'
import {AxiosError, AxiosResponse} from 'axios'
import Constants from '../downstream-services/Constants';
import YouTubeAxiosConfig from '../downstream-services/YouTubeAxiosConfig';


export default class YouTubeChannelActivity
{
	static retrieveYTChannelActivity = (router: Router) =>
	{
		router.post('/yt/channel/activity', (req: Request, res: Response) =>
		{
			YouTubeAxiosConfig.BASE_CONFIG
			.get('/activities'
				, {
					params: {
						channelId: Constants.SKC_CHANNEL_ID
					}
				}
			)
			.then((ytResponse: AxiosResponse) => {
				const formattedYtResponse = ytResponse.data.items.map((item: any) => {
					if (item.snippet.type === 'upload') {
						return {
							title: item.snippet.title
							, description: item.snippet.description
							, publishedAt: item.snippet.publishedAt
							, thumbnail: item.snippet.thumbnails.high
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

		YouTubeChannelActivity.retrieveYTChannelActivity(router)
		return router
	}


	static router: Router = YouTubeChannelActivity.initRouter()
}