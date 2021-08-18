import mongoose, { Schema, Document, connect } from 'mongoose'
import fs from 'fs'

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


async function run(): Promise<void> {
	const pem = fs.readFileSync('./certs/mongoDB-heart-api-X509.pem')

	await connect('mongodb+srv://heart-api-cluster.g0vnw.mongodb.net/news', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		authMechanism: 'MONGODB-X509',
		authSource: '$external',
		sslKey: pem,
		sslCert: pem,
		// authSource: './certs/mongoDB-heart-api-X509.pem'
	})
}

export default mongoose.model<News>('News', NewsSchema)