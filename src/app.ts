import express from 'express'
import morgan from 'morgan'

import HttpConfig from './http/HttpConfig'
import Routes from './routes/Routes'
import RequestErrorHandling from './http/RequestErrorHandling'

const app = express()

HttpConfig.setupHttpConnection(app)

app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

Routes.setupRoutes(app)
RequestErrorHandling.setupErrorHandling(app)

export default app