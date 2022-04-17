import HeartAPIError from '@error/HeartAPIError'
import EventModel, { Event } from '../models/EventModel'

export async function getEventsFromDB(service: string, tags: string[]): Promise<Event[]> {
	return EventModel.find(
		{ $and: [{ tags: { $in: tags } }, { service: { $eq: service } }] },
		['-_id', 'name', 'notes', 'location', 'eventDate', 'url', 'createdAt', 'updatedAt', 'service', 'tags'], // -_id removes _id field from result
		{
			sort: {
				eventDate: 1,
			},
		}
	)
}

export async function addEventToDB(name: string, notes: string, location: string, eventDate: Date, url: string, service: string, tags: string[]): Promise<any> {
	const event = new EventModel({ name, notes, location, eventDate, url, service, tags })

	return event.save().catch((err) => {
		console.log(`An error occurred when attempting to add Message record. Err: ${err.message}, object: ${event}`)
		throw new HeartAPIError('Error updating DB', 500)
	})
}
