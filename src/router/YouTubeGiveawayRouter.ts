import { Router } from 'express'
import YouTubeGiveAwayController from '../controller/YouTubeGiveawayController'

const ytGiveawayRouter = Router()
ytGiveawayRouter.get('/yt/video/giveaway', YouTubeGiveAwayController())

export default ytGiveawayRouter