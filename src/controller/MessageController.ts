import { NextFunction, Request, Response } from 'express'
import { addMessageToDB, getMessagesFromDB } from '../mongo/dao/MessageDAO.js'
import { Message } from '../mongo/models/MessageModel.js'
import HeartAPIError from '../error/HeartAPIError.js'
import uniq from 'lodash.uniq'

export async function getMessagesControllerCB(req: Request, res: Response, next: NextFunction) {
	const service = req?.query?.service as string

	const tags = req?.query?.tags as string
	const tagList = !tags ? [] : tags.split(',').map((tag: string) => tag.trim())

	if (!service) {
		next(new HeartAPIError('Query param "service" cannot be empty', 422))
	} else {
		getMessagesFromDB(service, tagList)
			.then((messages: Message[]) => {
				res.json({
					service: service,
					messages: messages,
				})
			})
			.catch((err) => {
				console.error(`Error occurred fetching messages from DB: ${err}`)
				next(new HeartAPIError('Error communicating w/ DB', 500))
			})
	}
}

export async function addMessageControllerCB(req: Request, res: Response, next: NextFunction) {
	const title: string | undefined = req?.body?.title as string
	const content: string | undefined = req?.body?.content as string
	const tags: string[] | undefined = req?.body?.tags as string[]

	const service: string | undefined = req?.query?.service as string

	if (!(title && content && service)) {
		next(new HeartAPIError('Request body needs "title" and "content" values. Query param "service" cannot be empty.', 422))
	} else {
		// only unique tags
		const uniqTags = uniq(tags)

		addMessageToDB(title, content, service, uniqTags)
			.then((messageId: string) => {
				res.status(201)
				res.json({ status: 'Message created', messageId: messageId })
			})
			.catch((err) => {
				next(err)
			})
	}
}
