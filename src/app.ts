import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import HttpConfig from '@config/HttpConfig'
import Routes from '@config/RouterConfig'
import RequestErrorHandling from '@config/RequestErrorHandlingConfig'


class App {
	public express = express()

	constructor() {
		HttpConfig.setupHttpConnection(this.express)
		this.applyMiddleware()
		Routes.setupRoutes(this.express)
		RequestErrorHandling.setupErrorHandling(this.express)
	}

	private applyMiddleware(): void {
		/*
			handles pre-flight
			server will return the allowed CORS functionality and stop processing the rest of the request, ie prevents error due to redirects in pre-flight
			Should be one of the first middleware added.
		*/
		this.express.options('*', cors())
		this.express.use(cors())	// opens up all CORS settings to clients

		this.express.use(morgan(process.env.MORGAN_LOG_LEVEL || 'dev'))
		this.express.use(express.urlencoded({ extended: true }))
		this.express.use(express.json())
	}
}

export default new App().express

