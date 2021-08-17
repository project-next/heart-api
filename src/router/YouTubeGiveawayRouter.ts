import { Router } from 'express'
import YouTubeGiveAwayController from '../controller/YouTubeGiveawayController'

const ytGiveawayRouter = Router()
ytGiveawayRouter.get('/yt/video/give-away', YouTubeGiveAwayController())

export default ytGiveawayRouter