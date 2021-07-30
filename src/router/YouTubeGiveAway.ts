import { Router } from 'express'
import YouTubeGiveAwayController from '../controller/YouTubeGiveAwayController'


export default class YouTubeGiveAway {
	readonly router = Router()


	constructor() {
		this.router.get('/yt/video/give-away', YouTubeGiveAwayController())
	}
}