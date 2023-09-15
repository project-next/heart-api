import { Request, Response } from 'express'
import fs from 'fs'
import jwt, { SignOptions } from 'jsonwebtoken'

const privateKey = fs.readFileSync('./certs/jwt.key')

const signature: SignOptions = {
	issuer: 'heart-api',
	subject: 'authentication',
	audience: 'skc',
	expiresIn: '3d',
	algorithm: 'RS256',
	jwtid: 'id',
}

export const createJwtControllerCB = (_: Request, res: Response) => {
	const payload = {
		dev: 'javi',
	}

	jwt.sign(payload, privateKey, signature, (err, token) => {
		if (err) {
			console.log(`Could not create JWT: ${err}`)
		}
		res.json({ jwt: token })
		res.end()
	})
}
