import {Express} from 'express'
import http from 'http'
import https from 'https'
import fs from 'fs'

export default class HttpConfig
{
	private static HTTP_PORT = process.env.HTTP_PORT || 80
	private static HTTPS_PORT = process.env.HTTPS_PORT || 443

	static setupHttpConnection = (app: Express) =>
	{
		const options = {
			key: fs.readFileSync(__dirname + '/certs/private.key', 'utf8')
			, cert: fs.readFileSync(__dirname + '/certs/certificate.crt', 'utf8')
			, ca: fs.readFileSync(__dirname + '/certs/ca_bundle.crt', 'utf-8')
		}

		console.log(`App starting on port ${HttpConfig.HTTP_PORT} for unsecured connections and ${HttpConfig.HTTPS_PORT} for secured connections`)

		https.createServer(options, app).listen(HttpConfig.HTTPS_PORT)
		http.createServer(app).listen( HttpConfig.HTTP_PORT )
	}
}