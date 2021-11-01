import { Request, Response } from 'express'
import { addNews, getNewsWithTag } from '@mongo/dao/NewsDAO'
import { News } from '@mongo/models/NewsModel'
import HeartAPIError from '@error/HeartAPIError'
import capitalize from 'lodash.capitalize'

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
	const title: string | undefined = req?.body?.title as string
	const content: string | undefined = req?.body?.content as string
	const tags: string[] | undefined = req?.body?.tags as string[]

	if (!(title && content)) {
		res.status(422)
		res.json(new HeartAPIError("Request body needs 'title' and 'content' values", 422))
	} else {
		addNews(capitalize(title), content, tags)
			.then(isSuccess => {
				if (isSuccess) {
					res.json({"status": "DB updated successfully"})
				} else {
					res.status(500)
					res.json(new HeartAPIError("Error updating DB", 500))
				}
			})
	}
}