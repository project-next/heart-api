import { Router, Request, Response } from 'express'
import Endpoint from './Endpoint'


export default class Status implements Endpoint {
	private static statusMessage = { status: 'API up and running' }

	public readonly router = Router()


	constructor() {
		this.get()
	}


	get(): void {
		this.router.get('/status', (req: Request, res: Response) => {
			res.json(Status.statusMessage)
		})
	}


	post(): void {
		throw new Error('Method not implemented.')
	}

}