import { Schema, Document, model } from 'mongoose'

export type News = Document & {
	title: string,
	content: string,
	tags: string[]
}


const NewsSchema: Schema = new Schema({
	title: { type: String, required: false, unique: false },
	body: { type: String, required: false, unique: false },
	tags: [{ type: String, required: false, unique: false }]
})


const NewsModel = model<News>('news', NewsSchema, 'news')
export default NewsModel