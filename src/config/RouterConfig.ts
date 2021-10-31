import { Express } from 'express'
import validateKeyCB from '@middleware/JWTAuthentication'
import youTubeGiveAwayControllerCB from '@controller/YouTubeGiveAwayController'
import youTubeChannelActivityControllerCB from '@controller/YouTubeUploadsController'
import youTubeVideoInfoControllerCB from '@controller/YouTubeVideoInfoController'
import statusControllerCB from '@controller/StatusController'
import { createJwtControllerCB } from '@controller/JWTController'
import { getNewsForService } from '@controller/News'

export default class Routes {
	static BASE_URI = '/api/v1'
	static YT_FUNCTIONALITY_BASE_URI = `${Routes.BASE_URI}/yt`

	/**
	 * Configures Express API to open up routes using Router objects.
	 * Each Router object should specify endpoints and HTTP methods each endpoint supports.
	 * @param app reference to Express API object that will be modified.
	 */
	static setupRoutes(app: Express): void {
		app.get(`${Routes.BASE_URI}/status`, statusControllerCB)
		app.get(`${Routes.YT_FUNCTIONALITY_BASE_URI}/channel/uploads`, youTubeChannelActivityControllerCB)
		app.get(`${Routes.YT_FUNCTIONALITY_BASE_URI}/video/info`, validateKeyCB, youTubeVideoInfoControllerCB)
		app.get(`${Routes.YT_FUNCTIONALITY_BASE_URI}/video/giveaway`, validateKeyCB, youTubeGiveAwayControllerCB)
		app.get(`${Routes.BASE_URI}/auth/jwt`, createJwtControllerCB)
		app.get(`${Routes.BASE_URI}/news`, getNewsForService)
	}
}