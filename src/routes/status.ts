import {Router, Request, Response} from 'express'
const status = Router()

const statusMessage = { status: 'API up and running' }

/* GET home page. */
status.get('/', (req: Request, res: Response) =>
{
	res.json( statusMessage )
})

export default status;