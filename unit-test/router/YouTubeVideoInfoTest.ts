import rewire from 'rewire'
import { expect } from 'chai'
import { AxiosResponse } from 'axios'
import { YouTubeAPIResponse, VideoInfoResponse } from '../../src/router/YouTubeVideoInfo'

describe('YouTubeVideoInfo tests', () => {
	const _YouTubeVideoInfo = rewire('../../src/router/YouTubeVideoInfo').__get__('YouTubeVideoInfo')
	const _YouTubeVideoInfoInstance = new _YouTubeVideoInfo()

	it('Checking creation of YouTube API request', () => {
		const promise: Promise<AxiosResponse<YouTubeAPIResponse>> = _YouTubeVideoInfoInstance.getYoutubeRequest("123")
		expect(promise).to.not.be.null
	})


	it('Checking creation of Heart API response', () => {
		const ytResponse: YouTubeAPIResponse = {
			"kind": "youtube#videoListResponse",
			"etag": "lImRuGZWGeI7f_73aeI5aAXb0HY",
			"items": [
				{
					"kind": "youtube#video",
					"etag": "zNpQ9SSTQoXZUYV7s6WYYxW54eQ",
					"id": "okINSj2Okxw",
					"statistics": {
						"viewCount": "52",
						"likeCount": "5",
						"dislikeCount": "0",
						"favoriteCount": "0",
						"commentCount": "6"
					}
				}
			],
			"pageInfo": {
				"totalResults": 1,
				"resultsPerPage": 1
			}
		}

		const videoInfoResponse: VideoInfoResponse = _YouTubeVideoInfoInstance.getVideoInfoResponse(ytResponse)

		expect(videoInfoResponse).to.not.be.null

		expect(videoInfoResponse.videoStats.views).to.not.be.null
		expect(videoInfoResponse.videoStats.likes).to.not.be.null
		expect(videoInfoResponse.videoStats.dislikes).to.not.be.null
		expect(videoInfoResponse.videoStats.favorites).to.not.be.null
		expect(videoInfoResponse.videoStats.numComments).to.not.be.null

		expect(videoInfoResponse.validVideo).to.be.true

		expect(videoInfoResponse.videoStats.views).to.equal(52)
		expect(videoInfoResponse.videoStats.likes).to.equal(5)
		expect(videoInfoResponse.videoStats.dislikes).to.equal(0)
		expect(videoInfoResponse.videoStats.favorites).to.equal(0)
		expect(videoInfoResponse.videoStats.numComments).to.equal(6)
	})


	it('Checking creation of Heart API response - no video found for given ID', () => {
		const ytResponse: YouTubeAPIResponse = {
			"kind": "youtube#videoListResponse",
			"etag": "YIUPVpqNjppyCWOZfL-19bLb7uk",
			"items": [],
			"pageInfo": {
				"totalResults": 0,
				"resultsPerPage": 0
			}
		}

		const videoInfoResponse: VideoInfoResponse = _YouTubeVideoInfoInstance.getVideoInfoResponse(ytResponse)

		expect(videoInfoResponse).to.not.be.null

		expect(videoInfoResponse.validVideo).not.null
		expect(videoInfoResponse.videoStats).to.be.undefined

		expect(videoInfoResponse.validVideo).to.be.false
	})


})