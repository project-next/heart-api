import HeartAPIError from '../../error/HeartAPIError.js'
import MessageModel, { Message } from '../models/MessageModel.js'

export async function getMessagesFromDB(service: string, tags: string[]): Promise<Message[]> {
	return MessageModel.find(
		{ $and: [{ tags: { $in: tags } }, { service: { $eq: service } }] },
		['-_id', 'title', 'content', 'tags', 'createdAt', 'updatedAt'], // -_id removes _id field from result
		{
			sort: {
				createdAt: -1,
			},
		}
	)
}

export async function addMessageToDB(title: string, content: string, service: string, tags: string[]): Promise<string> {
	const messageRecord = new MessageModel({ title, content, service, tags })

	await messageRecord.save().catch((err) => {
		console.error(`An error occurred when attempting to add Message record. Err: ${err.message}, object: ${messageRecord}`)
		throw new HeartAPIError('Error updating DB', 500)
	})

	return messageRecord.id
}
