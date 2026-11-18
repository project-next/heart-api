import { createPrivateKey } from 'crypto'
import type { KeyObject } from 'crypto'
import fs from 'fs'
import { SignJWT } from 'jose'

export const jwtPrivateKey = createPrivateKey(fs.readFileSync('./certs/jwt.key'))

// signs a JWT with the claims heart-api expects, override params to create invalid tokens - null expiration omits exp claim
export const signTestJWT = (key: KeyObject = jwtPrivateKey, audience = 'heart-api', expiration: string | number | null = '15m') => {
	const jwt = new SignJWT({}).setProtectedHeader({ alg: 'RS256' }).setIssuer('heart-api').setSubject('skc').setAudience(audience)

	if (expiration !== null) {
		jwt.setExpirationTime(expiration)
	}
	return jwt.sign(key)
}
