import axios from 'axios'
import Constants from './Constants'

export default class YouTubeAxiosConfig
{
	static YOUTUBE_UPLOADS_AXIOS_BASE_CONFIG = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}`
		, params: {
			key: Constants.YOUTUBE_API_KEY
			, part: 'snippet,contentDetails'
			, maxResults: 10
		}
	})
}