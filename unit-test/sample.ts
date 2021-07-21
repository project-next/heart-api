import rewire from 'rewire'
import { expect } from 'chai';

describe('Options tests', () => {
	const YouTubeVideoInfo = rewire('../src/routes/YouTubeVideoInfo').__get__('YouTubeVideoInfo')
	const YouTubeVideoInfoInstance = new YouTubeVideoInfo()

	it('checking default options', () => {
		const xxx = YouTubeVideoInfoInstance.youtubeRequest("123")
		expect(xxx).to.not.be.null
	})
})