import { Router, Request, Response } from 'express'
import Endpoint from './Endpoint'

type status = {
	status: string
	, version: string
}


export default class Status implements Endpoint {
	private static statusMessage = { status: 'API up and running', version: process.env.npm_package_version } as status

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