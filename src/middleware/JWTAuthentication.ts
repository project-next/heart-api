import HeartAPIError from '@error/HeartAPIError'
import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import jwt, { JsonWebTokenError, NotBeforeError, SignOptions, TokenExpiredError } from 'jsonwebtoken'


const publicKey = fs.readFileSync('./certs/jwt.pub')

const signature: SignOptions = {
	issuer: 'heart-api',
	subject: 'authentication',
	audience: 'skc',
	expiresIn: "15m",
	algorithm: "RS256",
	jwtid: "id"
}


export default function validateJWTMiddleware(req: Request, res: Response, next: NextFunction) {
	const authorizationHeader = req.headers?.authorization
	const authorizationHeaderTokens: string[] = (authorizationHeader == undefined)? [] : (authorizationHeader as string).split(' ')
	const token = (authorizationHeaderTokens.length === 2)? authorizationHeaderTokens[1] : ''

	try {
		jwt.verify(token, publicKey, signature)	// return value is payload, update code if payload is needed
		next()	// no errors
	} catch (err) {
		if (err instanceof TokenExpiredError) {
			console.error('Client provided token that has expired.')
			res.status(401)
			res.json(new HeartAPIError('Provided JWT has expired - no access granted', 401))
		} else if (err instanceof JsonWebTokenError) {
			console.error(`Error encountered during JWT verification ${err.message}`)
			res.status(401)
			res.json(new HeartAPIError(err.message, 401))
		} else if (err instanceof NotBeforeError) {
			console.error(`JWT time is invalid ${err.message}`)
			res.status(401)
			res.json(new HeartAPIError(err.message, 401))
		}
	}
}