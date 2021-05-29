import status from './status'
import {Express} from 'express'

export default class Routes
{

	static BASE_URI = '/heart/api/v1'
	static API_STATUS_URI = `${Routes.BASE_URI}/testcall`

	static setupRoutes = (app: Express) =>
	{
		app.use(Routes.API_STATUS_URI, status)
	}

}