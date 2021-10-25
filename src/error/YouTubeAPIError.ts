import { AxiosError } from 'axios'
import { YouTubeAPIGlobalError } from '../types/YouTubeAPIError'
import HeartAPIError from '@error/HeartAPIError'

export default class YouTubeAPIError {
	private ytError: YouTubeAPIGlobalError
	private is404: boolean = false

	constructor(error: AxiosError) {
		if (error.response?.status === 404) {
			this.is404 = true
		}
		this.ytError = error.response!.data as YouTubeAPIGlobalError
	}

	convertYTErrorToHeartAPIError(): HeartAPIError {
		let description = "YouTube API call encountered error"

		if (this.is404) {
			console.error('Trying to hit a URL that doesn\'t exist.')
			description = 'Using non existent YouTube API URL/Path'
		}
		else if (this.ytError != null) {
			console.error(`YouTube Data API (v3) returned with error: ${this.ytError.error.code} - ${this.ytError.error.message}`)

			if (this.ytError.error.code === 403) {
				description = 'Using incorrect API key or no API key when calling YouTube API'
			}
		}

		return new HeartAPIError(description, 500)
	}
}