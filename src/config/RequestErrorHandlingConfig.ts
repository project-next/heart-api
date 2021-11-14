import { Express, Request, Response, NextFunction } from 'express'
import HeartAPIError from '@error/HeartAPIError'

/**
 * Contains methods to configure common error handling for the Express API.
 */
export default class RequestErrorHandling {

	/**
	 * Calls all other error configuration methods.
	 * @param app reference to Express API object that will be modified.
	 */
	static setupErrorHandling(app: Express) {
		RequestErrorHandling.setup404ErrorHandling(app)
		RequestErrorHandling.setupGenericErrorHandling(app)
	}


	/**
	 * Sets up generic error message (Status: 500).
	 * @param app reference to Express API object that will be modified.
	 */
	private static setupGenericErrorHandling(app: Express) {
		app.use(function (heartApiErr: HeartAPIError, req: Request, res: Response, _next: NextFunction) {
			res
				.status(heartApiErr.code || 500)
				.send(heartApiErr)
		})
	}


	/**
	 * Handles 404 scenario - server doesn't have a valid route.
	 * @param app reference to Express API object that will be modified.
	 */
	private static setup404ErrorHandling(app: Express) {
		app.use(function (req: Request, _res: Response, next: NextFunction) {
			next(new HeartAPIError('Endpoint does not exist or existing endpoint cannot handle HTTP method specified.', 404))
		})
	}
}