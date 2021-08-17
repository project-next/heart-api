import { Router, Request, Response } from 'express'
import { status } from '../types/StatusTypes'

export default class Status {
	private static statusMessage = { status: 'API up and running', version: process.env.npm_package_version } as status

	public readonly router = Router()


	constructor() {
		this.router.get('/status', (req: Request, res: Response) => {
			res.json(Status.statusMessage)
		})
	}
}