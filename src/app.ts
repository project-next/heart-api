import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import HttpConfig from './http/HttpConfig'
import Routes from './routes/Routes'
import RequestErrorHandling from './http/RequestErrorHandling'

const app = express()

/*
	handles pre-flight
	server will return the allowed CORS functionality and stop processing the rest of the request, ie prevents error due to redirects in pre-flight
	Should be one of the first middleware added.
*/
app.options( '*', cors() )
app.use( cors() )	// opens up all CORS settings to clients

HttpConfig.setupHttpConnection(app)

app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

Routes.setupRoutes(app)
RequestErrorHandling.setupErrorHandling(app)

export default app