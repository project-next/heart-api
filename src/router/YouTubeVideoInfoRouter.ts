import { Router } from 'express'
import youTubeVideoInfoControllerCB from '../controller/YouTubeVideoInfoController'

const ytVideoInfoRouter = Router()
ytVideoInfoRouter.get('/yt/video/info', youTubeVideoInfoControllerCB)

export default ytVideoInfoRouter