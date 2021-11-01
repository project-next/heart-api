import { Request, Response } from 'express'
import { addNews, getNewsWithTag } from '@mongo/dao/NewsDAO'
import { News } from '@mongo/models/NewsModel'

export const getNewsForService = async (req: Request, res: Response) => {
	const service = req?.query?.service as string
	let newsItems: News[]

	await getNewsWithTag([service])
		.then((news: News[]) => {
			newsItems = news.map((newsItem): News => {
				return {
					title: newsItem.title,
					content:  newsItem.content
				} as News
			})
		})
	res.json(
		{
			"service": service,
			"items": newsItems!
		}
	)
}


export const addNewsForService = async (req: Request, res: Response) => {
	addNews()
	res.json("working")
}