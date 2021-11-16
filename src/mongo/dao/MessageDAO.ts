import HeartAPIError from "@error/HeartAPIError";
import CommunicationModel, { Message } from "../models/MessageModel";

export async function getMessagesFromDB(service: string, tags: string[]): Promise<Message[]> {
	return CommunicationModel.find(
		{ $and: [
			{ tags: { $in: tags } },
			{ service: { $eq: service } }
		]},
		['-_id', 'title', 'content', 'tags', 'createdAt', 'updatedAt'],	// -_id removes _id field from result
		{
			sort: {
			createdAt: -1
		}})
}


export async function addMessageToDB(title: string, content: string, service: string, tags: string[]): Promise<void> {
	return CommunicationModel
		.init()
		.then(async () => {
			const communicationRecord = new CommunicationModel({title, content, service, tags})

			await communicationRecord
				.save()
				.catch(err => {
					console.log(`An error occurred when attempting to add Message record. Err: ${err.message}, object: ${communicationRecord}`)
					throw new HeartAPIError('Error updating DB', 500)
				})
		})
		.catch(err => {
			console.log(`Error occurred initializing CommunicationModel: ${err}`)
			throw new HeartAPIError('Error updating DB', 500)
		})
}