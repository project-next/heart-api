import { Schema, Document, model } from 'mongoose'

export type Communication = Document & {
	title: string,
	content: string,
	service: string,
	tags?: string[]
}


const CommunicationSchema: Schema = new Schema({
	title: { type: String, required: true, unique: true },
	content: { type: String, required: true, unique: false },
	service: { type: String, required: true, unique: false },
	tags: [{ type: String, required: true, unique: false }]
}, {
	timestamps: true
})


const CommunicationModel = model<Communication>('communication', CommunicationSchema, 'communication')
export default CommunicationModel