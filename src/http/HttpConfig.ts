import {Express} from 'express'
import http from 'http'

export default class HttpConfig
{
	private static HTTP_PORT = process.env.HTTP_PORT || 80
	private static HTTPS_PORT = process.env.HTTPS_PORT || 443

	static setupHttpConnection = (app: Express) =>
	{
		console.log(`App starting on port ${ HttpConfig.HTTP_PORT } for unsecured connections and ${ HttpConfig.HTTPS_PORT } for secured connections`)
		http.createServer( app ).listen( HttpConfig.HTTP_PORT )
	}
}