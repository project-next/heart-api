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
		}
	})

	static retrieveYTChannelActivity = (router: Router) =>
	{
		router.get('/yt/channel/activity', (req: Request, res: Response) =>
		{
			YouTubeChannelActivity.ytAxiosInstance
			.get('/activities')
			.then((ytResponse: AxiosResponse) => {
				console.log(ytResponse)
				res.json(ytResponse.data)
			})
			.catch((error: AxiosError) => {
				console.log(error)
			})
			.then(function () {
			});
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