import { Request, Response } from 'express'
import { addNews, getNewsWithTag } from '@mongo/dao/NewsDAO'
import { News } from '@mongo/models/NewsModel'
import HeartAPIError from '@error/HeartAPIError'
import capitalize from 'lodash.capitalize'
import { uniq } from 'lodash'

export async function getNewsForService(req: Request, res: Response) {
	const service = req?.query?.service as string

	if (!service) {
		res.status(422)
		res.json(new HeartAPIError("Query param 'service' cannot be empty", 422))
	} else {
		let newsItems: News[]

		await getNewsWithTag([service])
			.then((news: News[]) => {
				newsItems = news.map((newsItem): News => {
					return {
						title: newsItem.title,
						content:  newsItem.content,
						tags:  newsItem.tags
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
}


export async function addNewsForService(req: Request, res: Response) {
	const title: string | undefined = req?.body?.title as string
	const content: string | undefined = req?.body?.content as string
	const tags: string[] | undefined = req?.body?.tags as string[]

	const service: string | undefined = req?.query?.service as string

	if (!(title && content && service)) {
		res.status(422)
		res.json(new HeartAPIError("Request body needs 'title' and 'content' values. Query param 'service' cannot be empty.", 422))
	} else {
		// add a tag specifying service name if not already present
		if (tags.indexOf(service) === -1) {
			tags.push(service)
		}

		// only unique tags
		const uniqTags = uniq(tags)

		addNews(capitalize(title), content, uniqTags)
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