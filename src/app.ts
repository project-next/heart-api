import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import compression from 'compression'

import HttpConfig from './config/HttpConfig.js'
import RequestErrorHandling from './config/RequestErrorHandlingConfig.js'
import Routes from './config/Routes.js'
import commonResHeaders from './middleware/CommonResHeaders.js'
import UtilityDBConnection from './mongo/UtilityDBConnection.js'

class App {
	public app = express()

	constructor() {
		UtilityDBConnection()
		HttpConfig.setupHttpConnection(this.app)
		this.applyMiddleware()
		Routes.setupRoutes(this.app)
		RequestErrorHandling.setupErrorHandling(this.app)
	}

	private applyMiddleware(): void {
		/*
			handles pre-flight
			server will return the allowed CORS functionality and stop processing the rest of the request, ie prevents error due to redirects in pre-flight
			Should be one of the first middleware added.
		*/
		this.app.use(
			cors({
				origin: ['http://localhost:3000', 'https://dev.thesupremekingscastle.com', 'https://thesupremekingscastle.com', 'https://www.thesupremekingscastle.com'],
				methods: ['get', 'put', 'options'],
			})
		)

		this.app.use(compression({ level: 6 }))

		this.app.use(morgan(process.env.MORGAN_LOG_LEVEL ?? 'dev'))
		this.app.use(express.urlencoded({ extended: true }))
		this.app.use(express.json())

		this.app.use(commonResHeaders)
	}
}

export default new App().app
