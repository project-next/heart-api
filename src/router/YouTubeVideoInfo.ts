import { Router } from 'express'
import YouTubeVideoInfoController from '../controller/YouTubeVideoInfoController'


export default class YouTubeVideoInfo {
	readonly router = Router()


	constructor() {
		this.router.get('/yt/video/info', YouTubeVideoInfoController())
	}
}