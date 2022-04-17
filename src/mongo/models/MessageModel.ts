import { Schema, Document, model } from 'mongoose'

export type Message = Document & {
	title: string
	content: string
	service?: string
	tags: string[]
	createdAt?: Date
	updatedAt?: Date
}

const CommunicationSchema: Schema = new Schema(
	{
		title: { type: String, required: true, unique: true },
		content: { type: String, required: true, unique: false },
		service: { type: String, required: true, unique: false },
		tags: [{ type: String, required: true, unique: false }],
		createdAt: { type: Date, required: false, unique: false },
		updatedAt: { type: Date, required: false, unique: false },
	},
	{
		timestamps: true,
	}
)

const CommunicationModel = model<Message>('message', CommunicationSchema)
export default CommunicationModel
