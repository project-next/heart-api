import { Router } from 'express'
import Endpoint from "./Endpoint"
import YouTubeGiveAwayController from '../controller/YouTubeGiveAwayController'


export default class YouTubeGiveAway implements Endpoint {
	readonly router = Router()


	constructor() {
		this.get()
	}


	get(): void {
		this.router.get('/yt/video/give-away', YouTubeGiveAwayController())
	}


	post(): void {
		throw new Error("Method not implemented.")
	}
}