import {Router, Request, Response} from 'express'


export default class Status
{
	private static getStatus = (router: Router) =>
	{
		router.get('/', (req: Request, res: Response) =>
		{
			res.json(Status.statusMessage)
		})
	}


	private static initRouter = () : Router =>
	{
		const router = Router()
		Status.getStatus(router)
		return router
	}


	static router: Router = Status.initRouter()
	private static statusMessage = { status: 'API up and running' }
}