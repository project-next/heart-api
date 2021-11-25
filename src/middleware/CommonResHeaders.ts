import { NextFunction, Request, Response } from "express";

export default function commonResHeaders(_req: Request, res: Response, next: NextFunction) {
	res
		.set({
			'Cache-Control': 'max-age=600'	// 10 minutes
		})
	next()
}