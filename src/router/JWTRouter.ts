import { Router } from 'express'
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


const jwtRouter = Router()
jwtRouter.get('/auth/jwt', (req: Request, res: Response) => {
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
})

export default jwtRouter