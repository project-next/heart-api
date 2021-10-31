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
		app.use(function (err: any, req: Request, res: Response) {
			// set locals, only providing error in development
			res.locals.message = err.message
			res.locals.error = req.app.get('env') === 'development' ? err : {}

			// render the error page
			res.status(err.status || 500)
			console.log(err)

			res.send('err')
		})
	}


	/**
	 * Handles 404 scenario - server doesn't have a valid route.
	 * @param app reference to Express API object that will be modified.
	 */
	private static setup404ErrorHandling(app: Express) {
		app.use(function (req: Request, res: Response, next: NextFunction) {
			res.status(404)
			res.send(new HeartAPIError('Endpoint does not exist or existing endpoint cannot handle HTTP method specified.', 404))
		})
	}
}