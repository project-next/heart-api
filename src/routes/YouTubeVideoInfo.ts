import {Router, Request, Response} from 'express'
import Constants from '../downstream-services/Constants';
import Endpoint from "./Endpoint";
import HeartAPIError from './HeartAPIError';

export default class YouTubeVideoInfo implements Endpoint
{
	readonly router = Router()


	constructor()
	{
		this.get()
	}


	get(): void
	{
		this.router.get('/yt/video/info', (req: Request, res: Response) =>
		{
			let status = 200
			if (req.query == null || req.query.key == null || req.query.videoId == null) {
				status = 400

				res.status(status)
				res.json(new HeartAPIError("Missing required query params.", status))
				res.send()
			} else if (req.query.key !== Constants.HEART_API_KEY) {
				let status = 401

				res.status(status)
				res.json(new HeartAPIError("API key is incorrect.", status))
				res.send()
			} else {
				res.send()
			}
		})
	}


	post(): void
	{
		throw new Error("Method not implemented.");
	}
}