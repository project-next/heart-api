import {Router, Request, Response} from 'express'
import axios, {AxiosError, AxiosResponse} from 'axios'
import Constants from '../downstream-services/Constants';


export default class YouTubeChannelActivity
{
	static ytAxiosInstance = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}`
		, params: {
			key: Constants.YOUTUBE_API_KEY
			, channelId: Constants.SKC_CHANNEL_ID
			, part: 'snippet'
			, maxResults: 15
		}
	})

	static retrieveYTChannelActivity = (router: Router) =>
	{
		router.post('/yt/channel/activity', (req: Request, res: Response) =>
		{
			YouTubeChannelActivity.ytAxiosInstance
			.get('/activities')
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
				console.log(`YouTube Data API (v3) returned with error: ${error.code}`)

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