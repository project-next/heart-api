import Status from '../router/StatusRouter'
import { Express } from 'express'
import ytVideoInfoRouter from '../router/YouTubeVideoInfoRouter'
import ytGiveawayRouter from '../router/YouTubeGiveawayRouter'
import ytChannelActivityRouter from '../router/YouTubeUploadsRouter'

export default class Routes {
	static BASE_URI = '/v1'

	static setupRoutes(app: Express): void {
		app.use(Routes.BASE_URI, new Status().router)
		app.use(Routes.BASE_URI, ytChannelActivityRouter)
		app.use(Routes.BASE_URI, ytVideoInfoRouter)
		app.use(Routes.BASE_URI, ytGiveawayRouter)
	}
}