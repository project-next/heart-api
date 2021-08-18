import { connect, connection } from 'mongoose'
import fs from 'fs'

const DB_NAME = 'services'


export default function mongoDBConn() {
	const pem = fs.readFileSync('./certs/mongoDB-heart-api-X509.pem')

	connection.on('error', () => {
		console.log(`There was an error connecting to heart-api:${DB_NAME} mongoDB`)
	})

	connection.once('open', () => {
		console.log(`Connection successfully established with heart-api:${DB_NAME} mongoDB`)
	})

	connect(`mongodb+srv://heart-api-cluster.g0vnw.mongodb.net/${DB_NAME}`, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,

		authMechanism: 'MONGODB-X509',
		authSource: '$external',
		sslKey: pem,
		sslCert: pem
	})
}