import { Router } from 'express'
import StatusRouter from '../controller/StatusController'


const statusRouter = Router()
statusRouter.get('/status', StatusRouter())

export default statusRouter