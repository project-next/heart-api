import { CallbackError } from "mongoose";
import NewsModel, { News } from "../models/NewsModel";

export async function getNewsWithTag(tags: string[]): Promise<News[]> {
	return NewsModel.find({tags: {$all: tags}})
}


export async function addNews(title: string, content: string, tags: string[]) {
	NewsModel.init()
		.then(async () => {
			const newsRecord = new NewsModel({title: title, content: content, tags})

			newsRecord.save((err: CallbackError, news: News) => {
				if (err) {
					console.log(`An error occurred when attempting to add News record. Err: ${err}, object: ${news}`)
				}
			})
		})
		.catch(err => {
			console.log(`Error occurred initializing NewsModel: ${err}`)
		})
}