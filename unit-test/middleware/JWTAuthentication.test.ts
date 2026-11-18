import { expect } from 'chai'
import { generateKeyPairSync } from 'crypto'
import type { NextFunction, Request, Response } from 'express'
import validateJWTMiddleware from '../../src/middleware/JWTAuthentication.js'
import { createJwtControllerCB } from '../../src/controller/JWTController.js'
import { signTestJWT } from '../helper/JWT.js'

// resolves to the error passed to next(), or undefined if the request was let through
const runMiddleware = async (authorization?: string) => {
	let nextArg: { code?: number; description?: string } | undefined
	await validateJWTMiddleware({ headers: { authorization } } as Request, {} as Response, (err?: unknown) => {
		nextArg = err as typeof nextArg
	})
	return nextArg
}

describe('JWTAuthentication tests', () => {
	it('JWT created by controller is accepted', async () => {
		const token = await new Promise<string>((resolve) => {
			createJwtControllerCB({} as Request, { json: (body: { jwt: string }) => resolve(body.jwt) } as unknown as Response, (() => {}) as NextFunction)
		})

		expect(await runMiddleware(`Bearer ${token}`)).to.be.undefined
	})

	it('Missing JWT is rejected', async () => {
		const err = await runMiddleware()
		expect(err?.code).to.equal(401)
		expect(err?.description).to.equal('jwt must be provided')
	})

	it('Malformed JWT is rejected', async () => {
		const err = await runMiddleware('Bearer 1234')
		expect(err?.code).to.equal(401)
		expect(err?.description).to.equal('jwt malformed')
	})

	it('JWT signed with a different key is rejected', async () => {
		const otherKey = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey
		const err = await runMiddleware(`Bearer ${await signTestJWT(otherKey)}`)
		expect(err?.code).to.equal(401)
		expect(err?.description).to.equal('invalid signature')
	})

	it('Expired JWT is rejected', async () => {
		const err = await runMiddleware(`Bearer ${await signTestJWT(undefined, 'skc', Math.floor(Date.now() / 1000) - 60)}`)
		expect(err?.code).to.equal(401)
		expect(err?.description).to.equal('Provided JWT has expired - no access granted')
	})

	it('JWT for a different audience is rejected', async () => {
		const err = await runMiddleware(`Bearer ${await signTestJWT(undefined, 'not-skc')}`)
		expect(err?.code).to.equal(401)
	})

	it('JWT without an expiration is rejected', async () => {
		const err = await runMiddleware(`Bearer ${await signTestJWT(undefined, 'skc', null)}`)
		expect(err?.code).to.equal(401)
	})
})
