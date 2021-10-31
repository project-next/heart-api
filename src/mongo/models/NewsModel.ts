import { Schema, Document, model } from 'mongoose'

export type News = Document & {
	title: string,
	content?: string,
	tags?: string[]
}


const NewsSchema: Schema = new Schema({
	title: { type: String, required: true, unique: true },
	content: { type: String, required: true, unique: false },
	tags: [{ type: String, required: true, unique: false }]
}, {
	timestamps: true
})


const NewsModel = model<News>('news', NewsSchema, 'news')
export default NewsModel