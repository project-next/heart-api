import { Router } from 'express'
import YouTubeChannelActivityController from '../controller/YouTubeChannelActivityController'

const ytChannelActivityRouter = Router()
ytChannelActivityRouter.get('/yt/channel/uploads', YouTubeChannelActivityController())

export default ytChannelActivityRouter