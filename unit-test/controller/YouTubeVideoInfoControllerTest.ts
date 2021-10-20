import { expect } from 'chai'

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../../src/app'
import YouTubeAxiosConfig from '../../src/config/YouTubeAxiosConfig'
import sinon, { SinonStub } from 'sinon'
import { YouTubeAPIResponse } from '../../src/types/YouTubeVideoInfoTypes'

describe('YouTubeVideoInfo tests', () => {
	chai.use(chaiHttp)
	let API_KEY: string | undefined
	let stub: SinonStub

	before(() => {
		API_KEY = process.env.HEART_API_KEY
	})


	beforeEach(() => {
		stub = sinon
			.stub(YouTubeAxiosConfig.YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG, 'get')
	})


	afterEach(() => {
		stub.restore()
	})


	it('Calling Video Info endpoint - missing key param', done => {
		chai
			.request(app)
			.get('/v1/yt/video/info?videoId=okINSj2Okxw')
			.end((err, res) => {
				expect(res.status).to.equal(401)

				expect(res.body).to.not.be.empty
				expect(res.body.code).to.equal(401)
				expect(res.body.description).to.equal('API key is missing')

				expect(stub.notCalled).to.be.true
				done()
			})
	})


	it('Calling Video Info endpoint - missing videoId param', done => {
		chai
			.request(app)
			.get(`/v1/yt/video/info?key=${API_KEY}`)
			.end((err, res) => {
				expect(res.status).to.equal(400)

				expect(res.body).to.not.be.empty
				expect(res.body.code).to.equal(400)
				expect(res.body.description).to.equal('Missing required query params.')

				expect(stub.notCalled).to.be.true
				done()
			})
	})


	it('Calling Video Info endpoint - using incorrect key value', done => {
		chai.request(app).get('/v1/yt/video/info?videoId=okINSj2Okxw&key=XXXXXXX').end((err, res) => {
			expect(res.status).to.equal(403)

			expect(res.body).to.not.be.empty
			expect(res.body.code).to.equal(403)
			expect(res.body.description).to.equal('API key is incorrect')

			expect(stub.notCalled).to.be.true
			done()
		})
	})


	it('Calling Video Info endpoint - YouTube API returns with non-error but body is empty', done => {
		stub.resolves(Promise.resolve({status: 200, data: undefined}))

		chai.request(app)
			.get(`/v1/yt/video/info?videoId=okINSj2Okxw&key=${API_KEY}`)
			.then((res) =>{
				expect(res.status).to.equal(500)

				expect(res.body).to.not.be.empty
				expect(res.body.code).to.equal(500)

				expect(stub.calledOnce).to.be.true	// since requests are memoized a call must have happened using stub or else test will use wrong response data
				done()
			})
	})


	it('Calling Video Info endpoint - success (invalid video)', done => {
		const returnData = {
			kind: "youtube#videoListResponse",
			etag: "NaZTcIozauhocCaldlq6PDK3f4s",
			items: [],
			pageInfo: {
				totalResults: 0,
				resultsPerPage: 0
			}
		} as YouTubeAPIResponse
		stub.resolves({status: 200, data: returnData})

		chai.request(app).get(`/v1/yt/video/info?videoId=RANDOM&key=${API_KEY}`).end((err, res) => {
			expect(res.status).to.equal(200)

			expect(res.body).to.not.be.empty
			expect(res.body.validVideo).to.be.false

			expect(stub.calledOnce).to.be.true	// since requests are memoized a call must have happened using stub or else test will use wrong response data
			done()
		})
	})


	it('Calling Video Info endpoint - success', done => {
		const returnData = {
			kind: "youtube#videoListResponse",
			etag: "NaZTcIozauhocCaldlq6PDK3f4s",
			items: [
				{
					kind: "youtube#video",
					etag: "zp0pYo1F5uEaNpwHdMwF5SQM_ww",
					id: "okINSj2Okxw",
					statistics: {
						viewCount: "66",
						likeCount: "6",
						dislikeCount: "0",
						favoriteCount: "0",
						commentCount: "6"
					}
				}
			],
			pageInfo: {
				totalResults: 1,
				resultsPerPage: 1
			}
		} as YouTubeAPIResponse
		stub.resolves({status: 200, data: returnData})

		chai.request(app).get(`/v1/yt/video/info?videoId=RANDOM-2&key=${API_KEY}`).end((err, res) => {
			expect(res.status).to.equal(200)

			expect(res.body).to.not.be.empty
			expect(res.body.validVideo).to.be.true
			expect(res.body.videoStats.views).to.equal(66)
			expect(res.body.videoStats.likes).to.equal(6)
			expect(res.body.videoStats.dislikes).to.equal(0)
			expect(res.body.videoStats.favorites).to.equal(0)
			expect(res.body.videoStats.numComments).to.equal(6)

			expect(stub.calledOnce).to.be.true	// since requests are memoized a call must have happened using stub or else test will use wrong response data
			done()
		})
	})


	it('Calling Video Info endpoint - YouTube server error', done => {
		stub
			.rejects({code: 403, response: {error: {status: 403}}})

		chai.request(app)
			.get(`/v1/yt/video/info?videoId=YOUTUBE-ERROR&key=${API_KEY}`)
			.end((err, res) => {
				expect(res.status).to.equal(500)

				expect(res.body).to.not.be.empty
				expect(res.body.code).to.equal(500)
				expect(res.body.description).to.not.be.empty

				expect(stub.calledOnce).to.be.true	// since requests are memoized a call must have happened using stub or else test will use wrong response data
				done()
		})
	})

})