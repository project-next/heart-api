import { AxiosError } from 'axios'
import { ytGlobalError } from '../types/YouTubeError'
import HeartAPIError from '../error/HeartAPIError'

export default class YouTubeAPIError {
	private ytError: ytGlobalError

	constructor(error: AxiosError) {
		this.ytError = error.response?.data
	}

	convertYTErrorToHeartAPIError(): HeartAPIError {
		if (this.ytError != null) {
			console.error(`YouTube Data API (v3) returned with error: ${this.ytError.error.code} - ${this.ytError.error.message}`)

			let description = (this.ytError.error.code === 403)? 'Request has incorrect API key or no API key.' : 'YouTube API call encountered an error'

			return new HeartAPIError(description, 500)
		}
		return new HeartAPIError("YouTube API call encountered error", 500)
	}
}