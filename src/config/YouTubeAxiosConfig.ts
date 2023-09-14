import axios, { AxiosInstance } from 'axios'
import Constants from '../helper/Constants.js'

export default class YouTubeAxiosConfig {
	/**
	 * Axios configuration for connecting to YouTube API to get uploaded videos.
	 */
	static readonly YOUTUBE_PLAYLIST_CONTENTS_AXIOS_BASE_CONFIG = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}/playlistItems`, // documentation for endpoint -> https://developers.google.com/youtube/v3/docs/playlistItems/list
		params: {
			key: Constants.YOUTUBE_API_KEY,
			part: 'snippet',
			maxResults: 10,
		},
	})
	/**
	 * Axios configuration for connecting to YouTube API to get channel info.
	 */
	static readonly YOUTUBE_CHANNEL_INFO_AXIOS_BASE_CONFIG = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}/channels`, // documentation for endpoint -> https://developers.google.com/youtube/v3/docs/channels/list
		params: {
			key: Constants.YOUTUBE_API_KEY,
			part: 'snippet,contentDetails,statistics',
		},
	})

	/**
	 * Axios configuration for connecting to YouTube API to get uploaded metadata on a specific video.
	 */
	static readonly YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG: AxiosInstance = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}/videos`,
		params: {
			key: Constants.YOUTUBE_API_KEY,
			part: 'statistics,topicDetails',
		},
	})

	/**
	 * Axios configuration for connecting to YouTube API to get comment metadata from a video and get only the metadata needed for giveaways.
	 */
	static readonly YOUTUBE_GIVE_AWAY_AXIOS_BASE_CONFIG = axios.create({
		baseURL: `${Constants.YOUTUBE_API_URL}/commentThreads`,
		params: {
			key: Constants.YOUTUBE_API_KEY,
			part: 'snippet',
			maxResults: 100,
			textFormat: 'plainText',
		},
	})
}
