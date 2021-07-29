import axios, { AxiosError, AxiosInstance } from 'axios'
import { Response } from 'express'
import HeartAPIError from '../error/HeartAPIError'
import Constants from '../constants/Constants'

export default class YouTubeAxiosConfig {
	static readonly YOUTUBE_UPLOADS_AXIOS_BASE_CONFIG = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}`
		, params: {
			key: Constants.YOUTUBE_API_KEY
			, part: 'snippet,contentDetails'
			, maxResults: 10
		}
	})


	static readonly YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG: AxiosInstance = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}`
		, params: {
			key: Constants.YOUTUBE_API_KEY
			, part: 'statistics,topicDetails'
		}
	})


	static readonly YOUTUBE_GIVE_AWAY_AXIOS_BASE_CONFIG = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}`
		, params: {
			key: Constants.YOUTUBE_API_KEY
			, part: 'snippet'
			, maxResults: 100
			, textFormat: 'plainText'
		}
	})


	static youtubeAPIErrorCallback(error: AxiosError, res: Response): void {
		if (error.response != null) {
			console.error(`YouTube Data API (v3) returned with error: ${error.code} ${error.response.status}`)

			let description = 'YouTube API call encountered error'
			if (error.response.status === 403) description = 'Request has incorrect API key or no API key.'

			const status = 500
			res.status(status)
			res.json(new HeartAPIError(description, status))
			res.end()
		} else {
			const status = 500
			res.status(status)
			res.json(new HeartAPIError("YouTube API call encountered error", status))
			res.end()
		}
	}


	static youtubeAPIErrorCallback2(error: AxiosError): [number, HeartAPIError] {
		if (error.response != null) {
			console.error(`YouTube Data API (v3) returned with error: ${error.code} ${error.response.status}`)

			let description = (error.response.status === 403)? 'Request has incorrect API key or no API key.' : 'YouTube API call encountered error'

			return [500, new HeartAPIError(description, 500)]
		}
		return [500, new HeartAPIError("YouTube API call encountered error", 500)]
	}
}