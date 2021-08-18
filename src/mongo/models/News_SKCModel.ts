import { Schema, Document, model } from 'mongoose'

export type skc = Document & {
	title: string,
	body: string,
	tags: string[]
}


const News_SKCSchema: Schema = new Schema({
	title: { type: String, required: false, unique: false },
	body: { type: String, required: false, unique: false },
	tags: [{ type: String, required: false, unique: false }]
})


const News_SKCModel = model<skc>('skc', News_SKCSchema, 'skc')
export default News_SKCModel