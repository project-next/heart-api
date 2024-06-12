import HeartAPIError from '../../error/HeartAPIError.js'
import EventModel, { Event } from '../models/EventModel.js'

export async function getEventsFromDB(service: string, tags: string[]): Promise<Event[]> {
	return EventModel.find(
		{ $and: [{ tags: { $in: tags } }, { service: { $eq: service } }, { eventDate: { $gte: new Date() } }] },
		['_id', 'name', 'notes', 'location', 'eventDate', 'url', 'createdAt', 'updatedAt', 'service', 'tags'], // -_id removes _id field from result
		{
			sort: {
				eventDate: 1,
			},
		}
	)
}

export async function addEventToDB(name: string, notes: string, location: string, eventDate: Date, url: string, service: string, tags: string[]): Promise<string> {
	const event = new EventModel({ name, notes, location, eventDate, url, service, tags })

	await event.save().catch((err) => {
		console.error(`An error occurred when attempting to add Message record. Err: ${err.message}, object: ${event}`)
		throw new HeartAPIError('Error updating DB', 500)
	})

	return event.id
}

export async function updateEvent(eventId: string, updatedEvent: Event): Promise<[number, Event | undefined]> {
	let status = 200
	let event: Event | undefined = undefined

	await EventModel.findByIdAndUpdate({ _id: eventId }, updatedEvent, { new: true })
		.then((newEvent) => {
			if (newEvent) {
				console.debug('Event updated successfully')
				event = newEvent
			} else {
				status = 404
				console.warn(`Event not found w/ given ID: ${eventId}`)
			}
		})
		.catch((err) => {
			console.error(`Error occurred while updating event w/ ID ${eventId}. Err: ${err.message}`)
			throw new HeartAPIError(`Error updating event w/ ID ${eventId}.`, 500)
		})

	return [status, event]
}
