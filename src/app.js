const express = require('express')
const app = express()
const logger = require('morgan')
require('dotenv').config()	// use dotenv package to import env vars

// local imports
const { basicServerSetup } = require('./app.http')

const baseUri = '/heart/api/v1'
const testCallUri = `${baseUri}/testcall`


app.use(logger('dev'))
app.use(express.urlencoded( { extended: true } ))
app.use(testCallUri, require('./routes/testcall'))

basicServerSetup(app)

module.exports = app