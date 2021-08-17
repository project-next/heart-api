import { Router } from 'express'
import YouTubeChannelActivityController from '../controller/YouTubeUploadsController'

const ytChannelActivityRouter = Router()
ytChannelActivityRouter.get('/yt/channel/uploads', YouTubeChannelActivityController())

export default ytChannelActivityRouter