import type { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import { createPrivateKey, randomUUID } from 'crypto'
import { SignJWT } from 'jose'
import HeartAPIError from '../error/HeartAPIError.js'

// createPrivateKey accepts PKCS#1 keys (BEGIN RSA PRIVATE KEY), jose's importPKCS8 doesn't
const privateKey = createPrivateKey(fs.readFileSync('./certs/jwt.key'))

export const createJwtControllerCB = async (_: Request, res: Response, next: NextFunction) => {
	const payload = {
		dev: 'javi',
	}

	try {
		const token = await new SignJWT(payload)
			.setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
			.setIssuer('heart-api')
			.setSubject('authentication')
			.setAudience('skc')
			.setIssuedAt()
			.setExpirationTime('15m')
			.setJti(randomUUID())
			.sign(privateKey)
		res.json({ jwt: token })
	} catch (err) {
		console.log(`Could not create JWT: ${err}`)
		next(new HeartAPIError('Could not create JWT', 500))
	}
}
