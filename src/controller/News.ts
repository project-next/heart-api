import { Request, Response } from 'express'
import { addNews, getNewsWithTag } from '@mongo/dao/NewsDAO'

export const getNewsForService = async (req: Request, res: Response) => {
	const service = req?.query?.service as string

	addNews()
	await getNewsWithTag([service])
	res.json({"body": service})
}


export const addNewsForService = async (req: Request, res: Response) => {
	addNews()
	// res.json({"body": service})
}