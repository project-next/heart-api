import { Request, Response, NextFunction } from 'express'
import Constants from '../helper/Constants'
import HeartAPIError from '../error/HeartAPIError'


export default function validateKey() {
	return (req: Request, res: Response, next: NextFunction) => {
		if (req.query.key == null) {
			const status = 401

			res.status(status)
			res.json(new HeartAPIError("API key is missing.", status))
			res.send()
		} else if (req.query.key !== Constants.HEART_API_KEY) {
			const status = 401

			res.status(status)
			res.json(new HeartAPIError("API key is incorrect.", status))
			res.send()
		} else {
			next()
		}
	}
}