import rewire from 'rewire'
import { expect } from 'chai'
import { AxiosResponse } from 'axios'
import { YouTubeAPIResponse, VideoInfoResponse } from '../src/routes/YouTubeVideoInfo'

describe('YouTubeVideoInfo tests', () => {
	const YouTubeVideoInfo = rewire('../src/routes/YouTubeVideoInfo').__get__('YouTubeVideoInfo')
	const YouTubeVideoInfoInstance = new YouTubeVideoInfo()


	it('Checking creation of YouTube API request', () => {
		const promise: Promise<AxiosResponse<YouTubeAPIResponse>> = YouTubeVideoInfoInstance.getYoutubeRequest("123")
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

		const videoInfoResponse: VideoInfoResponse = YouTubeVideoInfoInstance.getVideoInfoResponse(ytResponse)

		expect(videoInfoResponse).to.not.be.null

		expect(videoInfoResponse.views).to.not.be.null
		expect(videoInfoResponse.likes).to.not.be.null
		expect(videoInfoResponse.dislikes).to.not.be.null
		expect(videoInfoResponse.favorites).to.not.be.null
		expect(videoInfoResponse.numComments).to.not.be.null

		expect(videoInfoResponse.views).to.be.equal(52)
		expect(videoInfoResponse.likes).to.be.equal(5)
		expect(videoInfoResponse.dislikes).to.be.equal(0)
		expect(videoInfoResponse.favorites).to.be.equal(0)
		expect(videoInfoResponse.numComments).to.be.equal(6)
	})
})