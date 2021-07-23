import rewire from 'rewire'
import { expect } from 'chai'

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../../src/App'

describe('YouTubeVideoInfo tests', () => {
	chai.use(chaiHttp)

	it('Calling endpoint with 400 error', (done) => {
		chai
			.request(app)
			.get('/v1/yt/video/info')
			.end((err, res) => {
				expect(res.status).to.equal(400)
				done()
			})
	})


	it('Calling endpoint with 401 error', (done) => {
		chai.request(app).get('/v1/yt/video/info?videoId=okINSj2Okxw&key=XXXXXXX').end((err, res) => {
			expect(res.status).to.equal(401)
			done()
		})
	})


	it('Calling endpoint with success', (done) => {
		chai.request(app).get('/v1/yt/video/info?videoId=okINSj2Okxw&key=YT-API-KEY').end((err, res) => {
			expect(res.status).to.equal(200)
			expect(res.body).to.not.be.empty
			done()
		})
	})

})