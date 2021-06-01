import axios from 'axios'
import Constants from './Constants'

export default class YouTubeAxiosConfig
{
	static BASE_CONFIG = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}`
		, params: {
			key: Constants.YOUTUBE_API_KEY
			, part: 'snippet'
			, maxResults: 15
		}
	})
}