import { connect, connection } from 'mongoose'
import Constants from '@helper/Constants'

const DB_NAME = 'communication'


export default function mongoDBConn() {
	connection.on('error', () => {
		console.log(`There was an error connecting to heart-api:${DB_NAME} mongoDB`)
	})

	connection.once('open', () => {
		console.log(`Connection successfully established with ${Constants.HEART_API_DB_BASE_URI}:${DB_NAME} mongoDB`)
	})

	connect(`${Constants.HEART_API_DB_BASE_URI}/${DB_NAME}`, {
		authMechanism: 'MONGODB-X509',
		authSource: '$external',
		sslKey: './certs/mongoDB-heart-api-X509.pem',
		sslCert: './certs/mongoDB-heart-api-X509.pem'
	})
}