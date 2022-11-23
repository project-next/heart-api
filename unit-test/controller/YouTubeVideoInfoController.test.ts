import { expect } from 'chai'
import request from 'supertest'
import app from '../../src/app'
import YouTubeAxiosConfig from '../../src/config/YouTubeAxiosConfig'
import sinon, { SinonStub } from 'sinon'
import { YouTubeAPIUploadsResponse } from '../../src/types/YouTubeAPIVideoTypes'
import Constants from '../../src/helper/Constants'
import jwt from 'jsonwebtoken'

describe('YouTubeVideoInfo tests', () => {
	let youtubeAxiosStub: SinonStub
	let jwtStub: SinonStub

	before(() => {
		jwtStub = sinon.stub(jwt, 'verify').callsFake(() => {})
	})

	beforeEach(() => {
		youtubeAxiosStub = sinon.stub(YouTubeAxiosConfig.YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG, 'get')
	})

	afterEach(() => {
		youtubeAxiosStub.restore()
		jwtStub.resetHistory()
	})

	it('Calling Video Info endpoint - missing videoId param', (done) => {
		request(app)
			.get(`/api/v1/yt/video/info`)
			.end((err, res) => {
				expect(res.status).to.equal(400)

				expect(res.body).to.not.be.empty
				expect(res.body.code).to.equal(400)
				expect(res.body.description).to.equal(Constants.MISSING_REQUIRED_PARAM_MESSAGE)

				expect(youtubeAxiosStub.notCalled).to.be.true
				done()
			})
	})

	it('Calling Video Info endpoint - YouTube API returns with non-error but body is empty', (done) => {
		youtubeAxiosStub.resolves(Promise.resolve({ status: 200, data: undefined }))

		request(app)
			.get(`/api/v1/yt/video/info?videoId=okINSj2Okxw`)
			.then((res) => {
				expect(res.status).to.equal(500)

				expect(res.body).to.not.be.empty
				expect(res.body.code).to.equal(500)

				expect(youtubeAxiosStub.calledOnce).to.be.true // since requests are memoized a call must have happened using youtubeAxiosStub or else test will use wrong response data
				done()
			})
	})

	it('Calling Video Info endpoint - success (invalid video)', (done) => {
		const returnData = {
			kind: 'youtube#videoListResponse',
			etag: 'NaZTcIozauhocCaldlq6PDK3f4s',
			items: [],
			pageInfo: {
				totalResults: 0,
				resultsPerPage: 0,
			},
		} as YouTubeAPIUploadsResponse
		youtubeAxiosStub.resolves({ status: 200, data: returnData })

		request(app)
			.get(`/api/v1/yt/video/info?videoId=RANDOM`)
			.end((err, res) => {
				expect(res.status).to.equal(200)

				expect(res.body).to.not.be.empty
				expect(res.body.validVideo).to.be.false

				expect(youtubeAxiosStub.calledOnce).to.be.true // since requests are memoized a call must have happened using youtubeAxiosStub or else test will use wrong response data
				done()
			})
	})

	it('Calling Video Info endpoint - success', (done) => {
		const returnData = {
			kind: 'youtube#videoListResponse',
			etag: 'NaZTcIozauhocCaldlq6PDK3f4s',
			items: [
				{
					kind: 'youtube#video',
					etag: 'zp0pYo1F5uEaNpwHdMwF5SQM_ww',
					id: 'okINSj2Okxw',
					statistics: {
						viewCount: '66',
						likeCount: '6',
						dislikeCount: '0',
						favoriteCount: '0',
						commentCount: '6',
					},
				},
			],
			pageInfo: {
				totalResults: 1,
				resultsPerPage: 1,
			},
		} as YouTubeAPIUploadsResponse
		youtubeAxiosStub.resolves({ status: 200, data: returnData })

		request(app)
			.get(`/api/v1/yt/video/info?videoId=RANDOM-2`)
			.end((err, res) => {
				expect(res.status).to.equal(200)

				expect(res.body).to.not.be.empty
				expect(res.body.validVideo).to.be.true
				expect(res.body.videoStats.views).to.equal(66)
				expect(res.body.videoStats.likes).to.equal(6)
				expect(res.body.videoStats.dislikes).to.equal(0)
				expect(res.body.videoStats.favorites).to.equal(0)
				expect(res.body.videoStats.numComments).to.equal(6)

				expect(youtubeAxiosStub.calledOnce).to.be.true // since requests are memoized a call must have happened using youtubeAxiosStub or else test will use wrong response data
				done()
			})
	})

	it('Calling Video Info endpoint - YouTube server error', (done) => {
		youtubeAxiosStub.rejects({ code: 403, response: { error: { status: 403 } } })

		request(app)
			.get(`/api/v1/yt/video/info?videoId=YOUTUBE-ERROR`)
			.end((err, res) => {
				expect(res.status).to.equal(500)

				expect(res.body).to.not.be.empty
				expect(res.body.code).to.equal(500)
				expect(res.body.description).to.not.be.empty

				expect(youtubeAxiosStub.calledOnce).to.be.true // since requests are memoized a call must have happened using youtubeAxiosStub or else test will use wrong response data
				done()
			})
	})
})
