import { connect, connection } from 'mongoose'
import Constants from '@helper/Constants'
import CommunicationModel from './models/MessageModel'

const DB_NAME = 'utility'

export default function mongoDBConn() {
	connection.on('error', () => {
		console.log(`There was an error connecting to heart-api:${DB_NAME} mongoDB`)
	})

	connection.once('open', () => {
		console.log(`Connection successfully established with ${Constants.HEART_API_DB_BASE_URI}:${DB_NAME} mongoDB`)

		CommunicationModel.init().catch((err) => {
			console.log(`Error occurred initializing CommunicationModel: ${err}`)
		})
	})

	connect(`${Constants.HEART_API_DB_BASE_URI}/${DB_NAME}`, {
		authMechanism: 'MONGODB-X509',
		authSource: '$external',
		sslKey: './certs/mongoDB-heart-api-X509.pem',
		sslCert: './certs/mongoDB-heart-api-X509.pem',
	})
}
