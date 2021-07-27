import { Router } from 'express'
import Endpoint from "./Endpoint"
import YouTubeVideoInfoController from '../controller/YouTubeVideoInfoController'


export default class YouTubeVideoInfo implements Endpoint {
	readonly router = Router()


	constructor() {
		this.get()
	}


	get(): void {
		this.router.get('/yt/video/info', YouTubeVideoInfoController())
	}


	post(): void {
		throw new Error("Method not implemented.")
	}
}