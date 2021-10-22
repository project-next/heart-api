import { Express } from 'express'
import http from 'http'
import https from 'https'
import fs from 'fs'

/**
 * Helper class that will configure the HTTP portion of the Express App.
 * Configures port for HTTP and HTTPS connections.
 * For HTTPS connections, certs and key will be read from a pre-defined path.
 * Make sure to update certs and key in this path and when checking out from a different computer, copy certs and key in the path.
 */
export default class HttpConfig {

	static setupHttpConnection(app: Express) {
		const HTTP_PORT = process.env.HTTP_PORT || 80
		const  HTTPS_PORT = process.env.HTTPS_PORT || 443

		if (process.env.NODE_ENV !== 'test') {
			const options = {
				key: fs.readFileSync('./certs/private.key', 'utf8')
				, cert: fs.readFileSync('./certs/certificate.crt', 'utf8')
				, ca: fs.readFileSync('./certs/ca_bundle.crt', 'utf-8')
			}

			console.log(`App starting on port ${HTTP_PORT} for unsecured connections and ${HTTPS_PORT} for secured connections`)

			https.createServer(options, app).listen(HTTPS_PORT)
			http.createServer(app).listen(HTTP_PORT)
		}
	}
}