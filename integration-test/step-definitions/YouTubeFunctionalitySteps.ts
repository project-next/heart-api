import { Given, When, Then } from '@cucumber/cucumber'
import pactum from 'pactum'
import Spec from 'pactum/src/models/Spec'

let url: string
let giveAwayEndpointSpec: Spec


Given('user pings API for give away winner for video', () => {
	const HEART_API_HOST = 'https://heart-api.com'
	const ENDPOINT = '/v1/yt/video/giveaway'

	url = `${HEART_API_HOST}${ENDPOINT}`
})


When('user has request where videoId is {string}, giveAwayCode is {string}', (videoId: string, giveAwayCode: string) => {
	const KEY = process.env.HEART_API_KEY

	url = `${url}?key=${KEY}&videoId=${videoId}&giveAwayCode=${giveAwayCode}`
	giveAwayEndpointSpec =  pactum
	.spec()
	.get(url)
})


Then('API should return with success and the body of response should contain winner info', async () => {
	await giveAwayEndpointSpec
		.expectStatus(200)
		.expectBodyContains('totalEntries')
		.expectBodyContains('code')
		.expectBodyContains('winner')
})