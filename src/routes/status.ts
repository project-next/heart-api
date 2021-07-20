import { Router, Request, Response } from 'express'
import Endpoint from './Endpoint'
import * as packageJson from '../../package.json'


export default class Status implements Endpoint {
	private static statusMessage = { status: 'API up and running', version: packageJson.version }

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