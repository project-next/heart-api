import { AxiosError } from 'axios'
import { YouTubeAPIGlobalError } from '../types/YouTubeAPIError'
import HeartAPIError from '../error/HeartAPIError.js'

export default class YouTubeAPIError {
	private ytError: YouTubeAPIGlobalError
	private is404 = false

	constructor(error: AxiosError) {
		// this should not happen
		if (error.response === undefined) {
			console.log('YT request resulted in no response. This will probably cause breaking errors further up the stack.')
			this.ytError = {} as YouTubeAPIGlobalError
		} else {
			if (error.response.status === 404) {
				this.is404 = true
			}
			this.ytError = error.response.data as YouTubeAPIGlobalError
		}
	}

	convertYTErrorToHeartAPIError(): HeartAPIError {
		let description = 'YouTube API call encountered error'

		if (this.is404) {
			if (this.ytError.error.message.startsWith('The video identified by the')) {
				console.error("Using video ID for a video that doesn't exist")
				description = 'Check the video ID as it is incorrect'
			} else {
				console.error("Trying to hit a URL that doesn't exist.")
				description = 'Using non existent YouTube API URL/Path'
			}
		} else if (this.ytError != null) {
			console.error(`YouTube Data API (v3) returned with error: ${this.ytError.error.code} - ${this.ytError.error.message}`)

			if (this.ytError.error.code === 403) {
				description = 'Using incorrect API key or no API key when calling YouTube API'
			}
		}

		return new HeartAPIError(description, 500)
	}
}
