import CommunicationModel, { Communication } from "../models/CommunicationModel";

export async function getCommunicationWithTag(tags: string[]): Promise<Communication[]> {
	return CommunicationModel.find({tags: {$all: tags}})
}


export async function addCommunication(title: string, content: string, tags: string[]): Promise<boolean> {
	let isSuccess = true

	await CommunicationModel
		.init()
		.then(async () => {
			const communicationRecord = new CommunicationModel({title: title, content: content, tags})

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