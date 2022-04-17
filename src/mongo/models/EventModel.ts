import { model, Schema, Document } from 'mongoose'

export type Event = Document & {
	name: string
	notes?: string
	location?: string
	eventDate: Date
	service: string
	tags: string[]
	createdAt?: Date
	updatedAt?: Date
}

const EventSchema: Schema = new Schema(
	{
		name: { type: String, required: true, unique: false },
		notes: { type: String, required: false, unique: false },
		location: { type: String, required: false, unique: false },
		eventDate: { type: Date, required: true, unique: false },
		service: { type: String, required: true, unique: false },
		tags: [{ type: String, required: true, unique: false }],
		createdAt: { type: Date, required: false, unique: false },
		updatedAt: { type: Date, required: false, unique: false },
	},
	{
		timestamps: true,
	}
)

const EventModel = model<Event>('event', EventSchema)
export default EventModel
