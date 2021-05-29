import {Express, Request, Response, NextFunction} from 'express'

export default class RequestErrorHandling
{

	static setupErrorHandling = (app: Express) =>
	{
		RequestErrorHandling.setup404ErrorHandling(app)
		RequestErrorHandling.setupGenericErrorHandling(app)
	}


	private static setupGenericErrorHandling = (app: Express) =>
	{
		app.use(function (err: any, req: Request, res: Response, next: NextFunction)
		{
			// set locals, only providing error in development
			res.locals.message = err.message
			res.locals.error = req.app.get('env') === 'development' ? err : {}

			// render the error page
			res.status(err.status || 500)
			console.log(err)

			res.send('err')
		})
	}


	private static setup404ErrorHandling = (app: Express) =>
	{
		app.use(function (req: Request, res: Response, next: NextFunction)
		{
			res.status(404)
			res.send({'Description': 'Endpoint does not exist'})
		})
	}
}