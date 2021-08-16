import Status from '../router/Status'
import { Express } from 'express'
import ytVideoInfoRouter from '../router/YouTubeVideoInfo'
import ytGiveawayRouter from '../router/YouTubeGiveaway'
import ytChannelActivityRouter from '../router/YouTubeChannelActivity'

export default class Routes {
	static BASE_URI = '/v1'

	static setupRoutes(app: Express): void {
		app.use(Routes.BASE_URI, new Status().router)
		app.use(Routes.BASE_URI, ytChannelActivityRouter)
		app.use(Routes.BASE_URI, ytVideoInfoRouter)
		app.use(Routes.BASE_URI, ytGiveawayRouter)
	}
}