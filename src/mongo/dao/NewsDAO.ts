import NewsModel, { news } from "../models/NewsModel";

export async function getNewsWithTag(tags: string[]): Promise<news[]> {
	return await NewsModel.find({tags: {$all: tags}})
}