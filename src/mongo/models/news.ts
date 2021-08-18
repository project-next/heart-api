import mongoose, { Schema, Document } from 'mongoose'

export type News = Document & {
	title: string,
	body: string,
	tags: string[]
}

const NewsSchema: Schema = new Schema({
	title: { type: String, required: false, unique: false },
	body: { type: String, required: false, unique: false },
	tags: [{ type: String, required: false, unique: false }]
})

export default mongoose.model<News>('News', NewsSchema)