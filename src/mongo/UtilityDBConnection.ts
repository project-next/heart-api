import { connect, connection } from 'mongoose'
import Constants from '@helper/Constants'
import MessageModel from './models/MessageModel'

const DB_NAME = 'utility'

export default function UtilityDBConnection() {
	connection.on('error', () => {
		console.log(`There was an error connecting to heart-api:${DB_NAME} mongoDB`)
	})

	connection.once('open', () => {
		console.log(`Connection successfully established with ${Constants.HEART_API_DB_BASE_URI}:${DB_NAME} MongoDB`)
		console.log('Initializing connection to MongoDB collections...')

		MessageModel.init().catch((err) => {
			console.log(`Error occurred initializing MessageModel: ${err}`)
		})
	})

	connect(`${Constants.HEART_API_DB_BASE_URI}/${DB_NAME}`, {
		authMechanism: 'MONGODB-X509',
		authSource: '$external',
		sslKey: './certs/mongoDB-heart-api-X509.pem',
		sslCert: './certs/mongoDB-heart-api-X509.pem',
	})
}
