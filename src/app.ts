import express from 'express'
import morgan from 'morgan'
// import dotenv from 'dotenv'

import testcall from './routes/testcall'
import { basicServerSetup } from './app.http'

const app = express()
require('dotenv').config()	// use dotenv package to import env vars

const baseUri = '/heart/api/v1'
const testCallUri = `${baseUri}/testcall`


app.use(morgan('dev'))
app.use(express.urlencoded( { extended: true } ))
app.use(testCallUri, testcall)

basicServerSetup(app)

export default app