const http = require('http')
const HTTP_PORT = process.env.HTTP_PORT || 80

const HTTPS_PORT = process.env.HTTPS_PORT || 443

const basicServerSetup = (app) =>
{
	setup404
	setupErrorHandling(app)
	setupHttp(app)
}

const setupHttp = (app) =>
{
	console.log(`App starting on port ${ HTTP_PORT } for unsecured connections and ${ HTTPS_PORT } for secured connections`)
	http.createServer( app ).listen( HTTP_PORT )
}

const setupErrorHandling = (app) =>
{
	app.use(function (err, req, res, next)
	{
		// set locals, only providing error in development
		res.locals.message = err.message
		res.locals.error = req.app.get('env') === 'development' ? err : {}

		// render the error page
		res.status(err.status || 500)
		console.log(err)

		res.send('err')
	})
}

const setup404 = (app) =>
{
	app.use(function (req, res, next)
	{
		res.status(404)
		res.send('endpoint does not exist')
	})
}


module.exports = {
	basicServerSetup: basicServerSetup
}