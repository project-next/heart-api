import { Request, Response } from 'express'


const statusMessage = {
	status: 'API up and running',
	version: process.env.npm_package_version
}

/**
 * Logic for status endpoint.
 * @returns Express compliant call back for end point.
 */
export default function statusControllerCB(req: Request, res: Response) {
	res.status(200)
	res.json(statusMessage)
}