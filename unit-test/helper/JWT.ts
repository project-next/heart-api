import { createPrivateKey } from 'crypto'
import type { KeyObject } from 'crypto'
import fs from 'fs'
import { SignJWT } from 'jose'

export const jwtPrivateKey = createPrivateKey(fs.readFileSync('./certs/jwt.key'))

// signs a JWT with the claims heart-api expects, override params to create invalid tokens
export const signTestJWT = (key: KeyObject = jwtPrivateKey, audience = 'skc', expiration: string | number = '15m') =>
	new SignJWT({ dev: 'javi' })
		.setProtectedHeader({ alg: 'RS256' })
		.setIssuer('heart-api')
		.setSubject('authentication')
		.setAudience(audience)
		.setExpirationTime(expiration)
		.sign(key)
