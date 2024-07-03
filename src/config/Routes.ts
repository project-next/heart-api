import { Express, RequestHandler } from 'express'
import { getEventsControllerCB, createEventControllerCB, updateEventControllerCB } from '../controller/EventsController.js'
import { createJwtControllerCB } from '../controller/JWTController.js'
import { getMessagesControllerCB, addMessageControllerCB } from '../controller/MessageController.js'
import statusControllerCB from '../controller/StatusController.js'
import youTubeGiveAwayControllerCB from '../controller/YouTubeGiveAwayController.js'
import youTubeChannelActivityControllerCB from '../controller/YouTubeUploadsController.js'
import youTubeVideoInfoControllerCB from '../controller/YouTubeVideoInfoController.js'
import apiKeyAuthenticationMiddleware from '../middleware/APIKeyAuthentication.js'
import validateJWTMiddleware from '../middleware/JWTAuthentication.js'

export default class Routes {
	static readonly BASE_URI = '/api/v1'
	static readonly YT_FUNCTIONALITY_BASE_URI = `${Routes.BASE_URI}/yt`

	/**
	 * Configures Express API to open up routes.
	 * @param app reference to Express API object that will be modified.
	 */
	static setupRoutes(app: Express): void {
		app.get(`${Routes.BASE_URI}/status`, statusControllerCB)
		app.get(`${Routes.YT_FUNCTIONALITY_BASE_URI}/channel/uploads`, youTubeChannelActivityControllerCB as RequestHandler)
		app.get(`${Routes.YT_FUNCTIONALITY_BASE_URI}/video/info`, validateJWTMiddleware, youTubeVideoInfoControllerCB as RequestHandler)
		app.get(`${Routes.YT_FUNCTIONALITY_BASE_URI}/video/giveaway`, validateJWTMiddleware, youTubeGiveAwayControllerCB as RequestHandler)
		app.get(`${Routes.BASE_URI}/auth/jwt`, apiKeyAuthenticationMiddleware, createJwtControllerCB)

		// message endpoints
		app.get(`${Routes.BASE_URI}/message`, getMessagesControllerCB as RequestHandler)
		app.put(`${Routes.BASE_URI}/message`, validateJWTMiddleware, addMessageControllerCB as RequestHandler)

		// events endpoints
		app.get(`${Routes.BASE_URI}/events`, getEventsControllerCB)
		app.post(`${Routes.BASE_URI}/event`, validateJWTMiddleware, createEventControllerCB)
		app.patch(`${Routes.BASE_URI}/event/:eventId`, validateJWTMiddleware, updateEventControllerCB)
	}
}
