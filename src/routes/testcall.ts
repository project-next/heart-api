import {Router, Request, Response} from 'express'
const testcall = Router()

const testcallMessage = { status: 'API up and running' }

/* GET home page. */
testcall.get('/', (req: Request, res: Response) =>
{
	console.log( testcallMessage )
	res.json( testcallMessage )
})

export default testcall;