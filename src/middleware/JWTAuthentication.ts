import HeartAPIError from '@error/HeartAPIError'
import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import jwt, { JwtPayload, SignOptions, VerifyErrors } from 'jsonwebtoken'

const publicKey = fs.readFileSync('./certs/jwt.pub')

const signature: SignOptions = {
	issuer: 'heart-api',
	subject: 'authentication',
	audience: 'skc',
	expiresIn: "15m",
	algorithm: "RS256",
	jwtid: "id"
}


export default function validateKeyCB(req: Request, res: Response, next: NextFunction) {
	const authorizationHeaderTokens: string[] = (req.headers.authorization as string).split(' ')
	const token = (authorizationHeaderTokens.length === 2)? authorizationHeaderTokens[1] : ''

	jwt.verify(token, publicKey, signature, (err: VerifyErrors | null, payload: JwtPayload) => {
		if (err) {
			switch(err.name) {
				case 'TokenExpiredError':
					console.error('Client provided token that has expired.')
					res.status(401)
					res.json(new HeartAPIError('Provided JWT has expired - no access granted', 401))
					break
				case 'JsonWebTokenError':
					console.error(`Error encountered during JWT verification ${err.message}`)
					res.status(401)
					res.json(new HeartAPIError(err.message, 401))
					break
				default:
					res.json(err)
			}
		}
		else {
			console.debug('Successfully authenticated with JWT.')
			next()
		}
	})
}