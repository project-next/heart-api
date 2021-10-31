import NewsModel, { News } from "../models/NewsModel";

export async function getNewsWithTag(tags: string[]): Promise<News[]> {
	return await NewsModel.find({tags: {$all: tags}})
}