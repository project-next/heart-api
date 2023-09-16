import axios, { AxiosInstance } from 'axios'
import Constants from '../helper/Constants.js'

export default class YouTubeAxiosConfig {
	static readonly YOUTUBE_PLAYLIST_CONTENTS_AXIOS_CONFIG = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}/playlistItems`, // documentation for endpoint -> https://developers.google.com/youtube/v3/docs/playlistItems/list
		params: {
			key: Constants.YOUTUBE_API_KEY,
			part: 'snippet',
			maxResults: 20,
		},
	})

	static readonly YOUTUBE_CHANNEL_INFO_AXIOS_CONFIG = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}/channels`, // documentation for endpoint -> https://developers.google.com/youtube/v3/docs/channels/list
		params: {
			key: Constants.YOUTUBE_API_KEY,
			part: 'snippet,contentDetails,statistics',
		},
	})

	static readonly YOUTUBE_VIDEO_INFO_AXIOS_CONFIG: AxiosInstance = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}/videos`, // documentation for endpoint -> https://developers.google.com/youtube/v3/docs/videos/list
		params: {
			key: Constants.YOUTUBE_API_KEY,
			part: 'statistics,topicDetails',
		},
	})

	static readonly YOUTUBE_COMMENTS_AXIOS_CONFIG = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}/commentThreads`,
		params: {
			key: Constants.YOUTUBE_API_KEY,
			part: 'snippet',
			maxResults: 100,
			textFormat: 'plainText',
		},
	})
}
