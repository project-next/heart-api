import { Schema, Document, model } from 'mongoose'

export type skc = Document & {
	title: string,
	body: string,
	tags: string[]
}


const NewsSchema: Schema = new Schema({
	title: { type: String, required: false, unique: false },
	body: { type: String, required: false, unique: false },
	tags: [{ type: String, required: false, unique: false }]
})


const NewsModel = model<skc>('skc', NewsSchema, 'skc')
export default NewsModel