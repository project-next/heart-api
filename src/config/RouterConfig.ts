import Status from '../router/Status'
import YouTubeChannelActivity from '../router/YouTubeChannelActivity'
import { Express } from 'express'
import ytVideoInfoRouter from '../router/YouTubeVideoInfo'
import ytGiveawayRouter from '../router/YouTubeGiveaway'

export default class Routes {
	static BASE_URI = '/v1'

	static setupRoutes(app: Express): void {
		app.use(Routes.BASE_URI, new Status().router)
		app.use(Routes.BASE_URI, new YouTubeChannelActivity().router)
		app.use(Routes.BASE_URI, ytVideoInfoRouter)
		app.use(Routes.BASE_URI, ytGiveawayRouter)
	}
}