import Status from './Status'
import YouTubeChannelActivity from './YouTubeChannelActivity'
import {Express} from 'express'

export default class Routes
{

	static BASE_URI = '/heart/api/v1'

	static setupRoutes = (app: Express) =>
	{
		app.use(Routes.BASE_URI, Status.router)
		app.use(Routes.BASE_URI, YouTubeChannelActivity.router)
	}

}