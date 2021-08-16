import { Router } from 'express'
import YouTubeVideoInfoController from '../controller/YouTubeVideoInfoController'

const ytVideoInfoRouter = Router()
ytVideoInfoRouter.get('/yt/video/info', YouTubeVideoInfoController())

export default ytVideoInfoRouter