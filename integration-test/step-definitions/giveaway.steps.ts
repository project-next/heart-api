import { Given, When, Then } from '@cucumber/cucumber'
import pactum from 'pactum'
import Spec from 'pactum/src/models/Spec'

let url: string
let giveAwayEndpointSpec: Spec

Given('user needs info about a giveaway for a certain video', () => {
	const HEART_API_HOST = process.env.HEART_API_HOST
	const ENDPOINT = '/api/v1/yt/video/giveaway'

	url = `${HEART_API_HOST}${ENDPOINT}`
	giveAwayEndpointSpec = pactum.spec().get(url)
})

Given('user has correct JWT token', () => {
	const JWT = process.env.HEART_API_JWT
	giveAwayEndpointSpec.withHeaders('Authorization', `Bearer ${JWT}`)
})

Given('user has malformed JWT token', () => {
	giveAwayEndpointSpec.withHeaders('Authorization', 'Bearer 1234')
})

Given("user doesn't use a JWT key", function () {})

Given('videoId is {string}', (videoId: string) => {
	giveAwayEndpointSpec.withQueryParams('videoId', videoId)
})

Given('giveAwayCode is {string}', (giveAwayCode: string) => {
	giveAwayEndpointSpec.withQueryParams('giveAwayCode', giveAwayCode)
})

When('user calls API', () => {
	giveAwayEndpointSpec.end()
})

Then('API should return with success and the body of response should contain winner info. Response should have {int} total entries', async (entries: number) => {
	await giveAwayEndpointSpec
		.expectStatus(200)
		.expectBodyContains('totalEntries')
		.expectBodyContains('giveawayPhrase')
		.expectBodyContains('winner')
		.expectJson('totalEntries', entries)
})

Then('API should return with code {int} and description {string}', async (code: number, description: string) => {
	await giveAwayEndpointSpec.expectStatus(code).expectJson({ description: description, code: code })
})
