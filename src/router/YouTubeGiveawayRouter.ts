import { Router } from 'express'
import youTubeGiveAwayControllerCB from '../controller/YouTubeGiveawayController'

const ytGiveawayRouter = Router()
ytGiveawayRouter.get('/yt/video/giveaway', youTubeGiveAwayControllerCB)

export default ytGiveawayRouter