import { NextFunction, Request, Response } from 'express'
import { addCommunication, getCommunicationWithTag } from '@mongo/dao/CommunicationDAO'
import { Communication } from '@mongo/models/CommunicationModel'
import HeartAPIError from '@error/HeartAPIError'
import capitalize from 'lodash.capitalize'
import { uniq } from 'lodash'

export async function getCommunicationForService(req: Request, res: Response, next: NextFunction) {
	const service = req?.query?.service as string

	if (!service) {
		next(new HeartAPIError("Query param 'service' cannot be empty", 422))
	} else {
		let newsItems: Communication[]

		await getCommunicationWithTag([service])
			.then((news: Communication[]) => {
				newsItems = news.map((newsItem): Communication => {
					return {
						title: newsItem.title,
						content:  newsItem.content,
						tags:  newsItem.tags
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


export async function addCommunicationForService(req: Request, res: Response, next: NextFunction) {
	const title: string | undefined = req?.body?.title as string
	const content: string | undefined = req?.body?.content as string
	const tags: string[] | undefined = req?.body?.tags as string[]

	const service: string | undefined = req?.query?.service as string

	if (!(title && content && service)) {
		next(new HeartAPIError("Request body needs 'title' and 'content' values. Query param 'service' cannot be empty.", 422))
	} else {
		// add a tag specifying service name if not already present
		if (tags.indexOf(service) === -1) {
			tags.push(service)
		}

		// only unique tags
		const uniqTags = uniq(tags)

		addCommunication(capitalize(title), content, uniqTags)
			.then((isSuccess: boolean) => {
				if (isSuccess) {
					res.json({"status": "DB updated successfully"})
				} else {
					next(new HeartAPIError("Error updating DB", 500))
				}
			})
	}
}