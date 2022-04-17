import HeartAPIError from '@error/HeartAPIError'
import { addEventToDB, getEventsFromDB } from '@mongo/dao/EventDAO'
import { Event } from '@mongo/models/EventModel'
import { NextFunction, Request, Response } from 'express'
import uniq from 'lodash.uniq'

export function getEventsControllerCB(req: Request, res: Response, next: NextFunction) {
	const service = req?.query?.service as string

	const tags = req?.query?.tags as string
	const tagList = !tags ? [] : tags.split(',').map((tag: string) => tag.trim())

	if (!service) {
		next(new HeartAPIError('Query param "service" cannot be empty', 422))
	} else {
		getEventsFromDB(service, tagList)
			.then((messages: Event[]) => {
				res.json({
					service: service,
					messages: messages!,
				})
			})
			.catch((err) => {
				console.error(`Error occurred fetching messages from DB: ${err}`)
				next(new HeartAPIError('Error communicating w/ DB', 500))
			})
	}
}

export function createEventControllerCB(req: Request, res: Response, next: NextFunction) {
	const name: string | undefined = req?.body?.name as string
	const notes: string | undefined = req?.body?.notes as string
	const location: string | undefined = req?.body?.location as string
	const eventDate: Date | undefined = req?.body?.eventDate as Date
	const url: string | undefined = req?.body?.url as string
	const tags: string[] | undefined = req?.body?.tags as string[]

	const service: string | undefined = req?.query?.service as string

	if (!(name && eventDate && service)) {
		next(new HeartAPIError('Request body needs "name" and "eventDate" values. Query param "service" cannot be empty.', 422))
	} else {
		const uniqTags = uniq(tags) // only unique tags

		addEventToDB(name, notes, location, eventDate, url, service, uniqTags)
			.then(() => {
				res.json({ status: 'DB updated successfully' })
			})
			.catch((err) => {
				next(err)
			})
	}
}
