const router = require('express').Router()

const testcallMessage = { status: 'API up and running' }

/* GET home page. */
router.get('/', function(req, res)
{
	console.log( testcallMessage )
	res.json( testcallMessage )
})

module.exports = router