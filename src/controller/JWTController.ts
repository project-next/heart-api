import { Request, Response } from 'express'
import fs from 'fs'
import jwt, { SignOptions } from 'jsonwebtoken'

const privateKey = fs.readFileSync('./certs/jwt.key')

const signature: SignOptions = {
	issuer: 'heart-api',
	subject: 'authentication',
	audience: 'skc',
	expiresIn: "15m",
	algorithm: "RS256",
	jwtid: "id"
}

export const createJwtControllerCB = (req: Request, res: Response) => {
	const payload = {
		dev: 'javi'
	}

	jwt.sign(payload, privateKey, signature, (err, token) => {
		if (err) {
			console.log(err)
		}
		res.json({jwt: token})
		res.end()
	})
}