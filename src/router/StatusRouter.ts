import { Router } from 'express'
import statusControllerCB from '@controller/StatusController'


const statusRouter = Router()
statusRouter.get('/status', statusControllerCB)

export default statusRouter