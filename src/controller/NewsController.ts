import { NextFunction, Request, Response } from 'express'
import { addCommunication, getCommunication } from '@mongo/dao/CommunicationDAO'
import { Communication } from '@mongo/models/CommunicationModel'
import HeartAPIError from '@error/HeartAPIError'
import capitalize from 'lodash.capitalize'
import { uniq } from 'lodash'

export async function getCommunicationController(req: Request, res: Response, next: NextFunction) {
	const service = req?.query?.service as string

	const tags = req?.query?.tags as string
	const tagList = (!tags)? [] : tags.split(',').map((tag: string) => tag.trim())

	if (!service) {
		next(new HeartAPIError("Query param 'service' cannot be empty", 422))
	} else {
		let newsItems: Communication[]

		await getCommunication(service, tagList)
			.then((news: Communication[]) => {
				newsItems = news
					.map((newsItem): Communication => {
						return {
							title: newsItem.title,
							content: newsItem.content,
							tags: newsItem.tags,
							createdAt: newsItem.createdAt,
							updatedAt: newsItem.updatedAt
						} as Communication
					})
			})
		res.json(
			{
				"service": service,
				"newsItems": newsItems!
			}
		)
	}
}


export async function addCommunicationController(req: Request, res: Response, next: NextFunction) {
	const title: string | undefined = req?.body?.title as string
	const content: string | undefined = req?.body?.content as string
	const tags: string[] | undefined = req?.body?.tags as string[]

	const service: string | undefined = req?.query?.service as string

	if (!(title && content && service)) {
		next(new HeartAPIError("Request body needs 'title' and 'content' values. Query param 'service' cannot be empty.", 422))
	} else {
		// only unique tags
		const uniqTags = uniq(tags)

		addCommunication(capitalize(title), content, service, uniqTags)
			.then((isSuccess: boolean) => {
				if (isSuccess) {
					res.json({"status": "DB updated successfully"})
				} else {
					next(new HeartAPIError("Error updating DB", 500))
				}
			})
	}
}