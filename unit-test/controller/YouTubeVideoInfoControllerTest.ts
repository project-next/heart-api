import { expect } from 'chai'

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../../src/App'
import YouTubeAxiosConfig from '../../src/service/YouTubeAxiosConfig'
import sinon, {SinonMock, SinonStub} from 'sinon'
import { AxiosResponse } from 'axios';

describe('YouTubeVideoInfo tests', () => {
	chai.use(chaiHttp)
	let youTubeAxiosConfigMock: SinonStub
	let API_KEY: string

	before(() => {
		API_KEY = process.env.HEART_API_KEY
		// youTubeAxiosConfigMock = sinon.stub(YouTubeAxiosConfig.YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG, 'get')
		// youTubeAxiosConfigMock.resolves()
		// new AxiosResponse()
	})


	it('Calling Video Info endpoint with no query params', (done) => {
		chai
			.request(app)
			.get('/v1/yt/video/info')
			.end((err, res) => {
				expect(res.status).to.equal(400)
				done()
			})
	})


	it('Calling Video Info endpoint - missing key param', (done) => {
		chai
			.request(app)
			.get('/v1/yt/video/info?videoId=okINSj2Okxw')
			.end((err, res) => {
				expect(res.status).to.equal(400)
				done()
			})
	})


	it('Calling Video Info endpoint - missing videoId param', (done) => {
		chai
			.request(app)
			.get('/v1/yt/video/info?key=XXXXXXX')
			.end((err, res) => {
				expect(res.status).to.equal(400)
				done()
			})
	})


	it('Calling Video Info endpoint - using incorrect key value', (done) => {
		chai.request(app).get('/v1/yt/video/info?videoId=okINSj2Okxw&key=XXXXXXX').end((err, res) => {
			expect(res.status).to.equal(401)
			done()
		})
	})


	it('Calling Video Info endpoint - success', (done) => {
		chai.request(app).get(`/v1/yt/video/info?videoId=okINSj2Okxw&key=${API_KEY}`).end((err, res) => {
			expect(res.status).to.equal(200)
			expect(res.body).to.not.be.empty
			done()
		})
	})

})