import { NextFunction, Request, Response } from 'express'

export function getEventsControllerCB(req: Request, res: Response, next: NextFunction) {
	res.json({
		yo: 'xxxxx',
	})
}

export function createEventControllerCB(req: Request, res: Response, next: NextFunction) {
	res.json({
		yo: 'yyyyyyy',
	})
}
