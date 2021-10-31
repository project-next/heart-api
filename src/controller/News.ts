import { Request, Response } from 'express'

export const getNewsForService = (req: Request, res: Response) => {
	const service = req?.query?.service

	res.json({"body": service})
}