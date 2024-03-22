import Constants from '../helper/Constants.js'
import MessageModel from './models/MessageModel.js'
import EventModel from './models/EventModel.js'
import mongoose from 'mongoose'

const DB_NAME = 'utility'

export default function UtilityDBConnection() {
	mongoose.set('strictQuery', true)

	mongoose.connection.on('error', () => {
		console.log(`There was an error connecting to heart-api:${DB_NAME} mongoDB`)
	})

	mongoose.connection.once('open', () => {
		console.log(`Connection successfully established with ${Constants.DB_HOST}:${DB_NAME} MongoDB`)

		MessageModel.init().catch((err) => {
			console.log(`Error occurred initializing MessageModel: ${err}`)
		})

		EventModel.init().catch((err) => {
			console.log(`Error occurred initializing EventModel: ${err}`)
		})
	})

	mongoose.connect(`${Constants.DB_HOST}/${DB_NAME}`, {
		tlsAllowInvalidCertificates: false,
		tlsCertificateKeyFile: './certs/mongoDB-heart-api-X509.pem',
		authMechanism: 'MONGODB-X509',
		authSource: '$external',
	})
}
