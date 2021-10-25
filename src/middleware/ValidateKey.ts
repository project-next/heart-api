import { Request, Response, NextFunction } from 'express'
import Constants from '@helper/Constants'
import HeartAPIError from '@error/HeartAPIError'

export default function validateKeyCB(req: Request, res: Response, next: NextFunction) {
	if (req.query.key == null) {
		console.log(`Client did not send an API key`)
		const status = 401

		res.status(status)
		res.json(new HeartAPIError("API key is missing", status))
		res.send()
	} else if (req.query.key !== Constants.HEART_API_KEY) {
		console.log(`Client is using incorrect API key, key: ${req.query.key}`)
		const status = 403

		res.status(status)
		res.json(new HeartAPIError("API key is incorrect", status))
		res.send()
	} else {
		next()
	}
}