import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'

import HttpConfig from './http/HttpConfig'
import Routes from './routes/Routes'
import RequestErrorHandling from './http/RequestErrorHandling'

const app = express()

app.use(morgan('dev'))
app.use(express.urlencoded( { extended: true } ))

HttpConfig.setupHttpConnection(app)

Routes.setupRoutes(app)
RequestErrorHandling.setupErrorHandling(app)

export default app