import { Router } from 'express'
import youTubeChannelActivityControllerCB from '../controller/YouTubeUploadsController'

const ytChannelActivityRouter = Router()
ytChannelActivityRouter.get('/yt/channel/uploads', youTubeChannelActivityControllerCB)

export default ytChannelActivityRouter