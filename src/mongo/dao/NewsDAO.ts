import NewsModel, { News } from "../models/NewsModel";

export async function getNewsWithTag(tags: string[]): Promise<News[]> {
	return NewsModel.find({tags: {$all: tags}})
}


export async function addNews(title: string, content: string, tags: string[]): Promise<boolean> {
	let isSuccess = true

	await NewsModel
		.init()
		.then(async () => {
			const newsRecord = new NewsModel({title: title, content: content, tags})

			try {
				await newsRecord.save()
			} catch (err) {
				if (err) {
					console.log(`An error occurred when attempting to add News record. Err: ${err}, object: ${newsRecord}`)
					isSuccess = false
				}
			}
		})
		.catch(err => {
			console.log(`Error occurred initializing NewsModel: ${err}`)
			isSuccess = false
		})

	return isSuccess
}