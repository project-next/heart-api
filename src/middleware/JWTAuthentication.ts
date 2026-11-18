import HeartAPIError from '../error/HeartAPIError.js'
import type { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import { createPublicKey } from 'crypto'
import { errors, jwtVerify } from 'jose'
import type { JWTVerifyOptions } from 'jose'

const publicKey = createPublicKey(fs.readFileSync('./certs/jwt.pub'))

const opts: JWTVerifyOptions = {
	issuer: 'heart-api',
	subject: 'skc', // client the token was issued to
	audience: 'heart-api', // only heart-api accepts its tokens
	algorithms: ['RS256'],
	requiredClaims: ['exp'], // tokens without an expiration would otherwise never expire
}

export default async function validateJWTMiddleware(req: Request, res: Response, next: NextFunction) {
	const authorizationHeader = req.headers?.authorization
	const authorizationHeaderTokens: string[] = authorizationHeader == undefined ? [] : authorizationHeader.split(' ')
	const isBearer = authorizationHeaderTokens.length === 2 && authorizationHeaderTokens[0].toLowerCase() === 'bearer' // auth schemes are case-insensitive
	const token = isBearer ? authorizationHeaderTokens[1] : ''

	if (token === '') {
		console.error('Client did not provide a JWT.')
		next(new HeartAPIError('jwt must be provided', 401))
		return
	}

	try {
		await jwtVerify(token, publicKey, opts) // return value is payload, update code if payload is needed
		next() // no errors
	} catch (err) {
		if (err instanceof errors.JWTExpired) {
			console.error('Client provided token that has expired.')
			next(new HeartAPIError('Provided JWT has expired - no access granted', 401))
		} else if (err instanceof errors.JWSInvalid || err instanceof errors.JWTInvalid) {
			console.error(`Client provided malformed JWT ${err.message}`)
			next(new HeartAPIError('jwt malformed', 401))
		} else if (err instanceof errors.JWSSignatureVerificationFailed) {
			console.error(`JWT signature is invalid ${err.message}`)
			next(new HeartAPIError('invalid signature', 401))
		} else if (err instanceof errors.JOSEError) {
			console.error(`Error encountered during JWT verification ${err.message}`)
			next(new HeartAPIError(err.message, 401))
		} else {
			next(err)
		}
	}
}
