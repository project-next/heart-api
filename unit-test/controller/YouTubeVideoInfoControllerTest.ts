import { expect } from 'chai'

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../../src/App'
import YouTubeAxiosConfig from '../../src/service/YouTubeAxiosConfig'
import sinon, { SinonStub, SinonSandbox, createSandbox } from 'sinon'
import { YouTubeAPIResponse } from '../../src/model/VideoInfoEndpointTypes'

describe('YouTubeVideoInfo tests', () => {
	chai.use(chaiHttp)
	let API_KEY: string
	let sandbox: SinonSandbox

	before(() => {
		API_KEY = process.env.HEART_API_KEY
		sandbox = createSandbox()
	})
	afterEach(() => {
		sandbox.restore()
	})


	it('Calling Video Info endpoint with no query params', done => {
		chai
			.request(app)
			.get('/v1/yt/video/info')
			.end((err, res) => {
				expect(res.status).to.equal(400)

				expect(res.body).to.not.be.empty
				expect(res.body.code).to.equal(400)
				expect(res.body.description).to.equal('Missing required query params.')
				done()
			})
	})


	it('Calling Video Info endpoint - missing key param', done => {
		chai
			.request(app)
			.get('/v1/yt/video/info?videoId=okINSj2Okxw')
			.end((err, res) => {
				expect(res.status).to.equal(400)

				expect(res.body).to.not.be.empty
				expect(res.body.code).to.equal(400)
				expect(res.body.description).to.equal('Missing required query params.')
				done()
			})
	})


	it('Calling Video Info endpoint - missing videoId param', done => {
		chai
			.request(app)
			.get('/v1/yt/video/info?key=XXXXXXX')
			.end((err, res) => {
				expect(res.status).to.equal(400)

				expect(res.body).to.not.be.empty
				expect(res.body.code).to.equal(400)
				expect(res.body.description).to.equal('Missing required query params.')
				done()
			})
	})


	it('Calling Video Info endpoint - using incorrect key value', done => {
		chai.request(app).get('/v1/yt/video/info?videoId=okINSj2Okxw&key=XXXXXXX').end((err, res) => {
			expect(res.status).to.equal(401)

			expect(res.body).to.not.be.empty
			expect(res.body.code).to.equal(401)
			expect(res.body.description).to.equal('API key is incorrect.')
			done()
		})
	})


	it('Calling Video Info endpoint - YouTube API returns with non-error but body is empty', done => {
		let youTubeAxiosConfigMock = sandbox
			.stub(new YouTubeAxiosConfig().YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG, 'get')
		youTubeAxiosConfigMock.returns(Promise.resolve({status: 200, data: undefined}))

		chai.request(app)
			.get(`/v1/yt/video/info?videoId=okINSj2Okxw&key=${API_KEY}`)
			.then((res) =>{
				expect(res.status).to.equal(500)

				expect(res.body).to.not.be.empty
				expect(res.body.code).to.equal(500)

				done()
			})
	})


	it('Calling Video Info endpoint - success (invalid video)', done => {
		const returnData = {
			kind: undefined,
			etag: undefined,
			items: [],
			pageInfo: {
				totalResults: undefined,
				resultsPerPage: undefined
			}
		} as YouTubeAPIResponse


		let youTubeAxiosConfigMock = sandbox
			.stub(new YouTubeAxiosConfig().YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG, 'get')
		youTubeAxiosConfigMock.returns(Promise.resolve({status: 200, data: returnData}))

		chai.request(app).get(`/v1/yt/video/info?videoId=okINSj2Okxw&key=${API_KEY}`).end((err, res) => {
			expect(res.status).to.equal(200)

			expect(res.body).to.not.be.empty
			expect(res.body.validVideo).to.be.false

			done()
		})
	})


	// it('Calling Video Info endpoint - success', done => {
	// 	const returnData = {
	// 		kind: undefined,
	// 		etag: undefined,
	// 		items: [
	// 			{
	// 			kind: undefined,
	// 			etag: undefined,
	// 			id: undefined,
	// 			statistics: {
	// 				viewCount: "1000",
	// 				likeCount: "500",
	// 				dislikeCount: "1",
	// 				favoriteCount: "33",
	// 				commentCount: "440"
	// 			}
	// 			}
	// 		],
	// 		pageInfo: {
	// 			totalResults: undefined,
	// 			resultsPerPage: undefined
	// 		}
	// 	} as YouTubeAPIResponse

	// 	const youTubeAxiosConfigMock: SinonStub = sinon
	// 		.stub(YouTubeAxiosConfig.YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG, 'get')
	// 	youTubeAxiosConfigMock.resolves({status: 200, data: returnData})

	// 	chai.request(app).get(`/v1/yt/video/info?videoId=okINSj2Okxw&key=${API_KEY}`).end((err, res) => {
	// 		expect(res.status).to.equal(200)
	// 		expect(res.body).to.not.be.empty
	// 		expect(res.body.validVideo).to.be.true

	// 		sinon.restore()
	// 		done()
	// 	})
	// })


	// it('Calling Video Info endpoint - YouTube server error', done => {
	// 	const youTubeAxiosConfigMock: SinonStub = sinon
	// 		.stub(YouTubeAxiosConfig.YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG, 'get')
	// 	youTubeAxiosConfigMock.throws({code: 403, response: {error: {code: 403}}})

	// 	chai.request(app)
	// 		.get(`/v1/yt/video/info?videoId=okINSj2Okxw&key=${API_KEY}`)
	// 		.end((err, res) => {
	// 			expect(res.status).to.equal(200)
	// 			expect(res.body).to.not.be.empty
	// 			expect(youTubeAxiosConfigMock.calledOnce).to.equal(true)
	// 			done()
	// 	})
	// })

})