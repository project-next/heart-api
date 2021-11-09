import CommunicationModel, { Communication } from "../models/CommunicationModel";

export async function getCommunication(service: string, tags: string[]): Promise<Communication[]> {
	console.log(tags)
	return CommunicationModel.find({ $and: [    { tags: { $all: tags } }, { service: { $eq: service } }     ]})
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
					console.log(`An error occurred when attempting to add Communication record. Err: ${err}, object: ${communicationRecord}`)
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