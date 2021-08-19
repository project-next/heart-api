import { Request, Response } from 'express'
import { status } from '../types/StatusTypes'


const statusMessage = { status: 'API up and running', version: process.env.npm_package_version } as status

export default function StatusRouter() {
	return (req: Request, res: Response) => {
		res.json(statusMessage)
	}
}