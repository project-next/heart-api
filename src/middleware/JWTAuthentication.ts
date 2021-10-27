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
					res.send('Provided JWT has expired - no access granted')
					break
				case 'JsonWebTokenError':
					console.log(err)
					res.send('No JWT token was provided in Authorization header')
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