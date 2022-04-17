import { model, Schema, Document } from 'mongoose'

export type Event = Document & {
	name: string
	date: Date
	service: string
	tags: string[]
}

const EventSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		date: { type: Date, required: true, unique: true },
		service: { type: String, required: true, unique: true },
		tags: [{ type: Date, required: true, unique: true }],
	},
	{
		timestamps: true,
	}
)

const EventModel = model<Event>('event', EventSchema)
export default EventModel
