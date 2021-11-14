import CommunicationModel, { Message } from "../models/MessageModel";

export async function getCommunication(service: string, tags: string[]): Promise<Message[]> {
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


export async function addCommunication(title: string, content: string, service: string, tags: string[]): Promise<boolean> {
	let isSuccess = true

	await CommunicationModel
		.init()
		.then(async () => {
			const communicationRecord = new CommunicationModel({title, content, service, tags})

			try {
				await communicationRecord.save()
			} catch (err) {
				if (err) {
					console.log(`An error occurred when attempting to add Message record. Err: ${err}, object: ${communicationRecord}`)
					isSuccess = false
				}
			}
		})
		.catch(err => {
			console.log(`Error occurred initializing CommunicationModel: ${err}`)
			isSuccess = false
		})

	return isSuccess
}