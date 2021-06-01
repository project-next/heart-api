import {Router, Request, Response} from 'express'


export default class YouTubeChannelActivity
{
	static retrieveYTChannelActivity = (router: Router) =>
	{
		router.get('/yt/channel/activity', (req: Request, res: Response) =>
		{

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