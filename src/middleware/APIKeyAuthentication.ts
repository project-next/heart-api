import HeartAPIError from "@error/HeartAPIError";
import Constants from "@helper/Constants";
import { Request, Response, NextFunction } from "express";


export default function apiKeyAuthenticationMiddleware(req: Request, res: Response, next: NextFunction): void {
	const headers = req?.headers
	const apiKey = (headers == null)? null : headers['heart-api-key']

	if (apiKey === Constants.HEART_API_KEY) {
		console.debug('User successfully authenticated using API key.')
		next()
	} else {
		console.error('User provided incorrect API key.')
		next(new HeartAPIError("Incorrect API key", 401))
	}
}