export default class Constants
{
	static YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3'
	static YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

	static HEART_API_KEY = process.env.HEART_API_KEY

	static SKC_CHANNEL_ID = 'UCBZ_1wWyLQI3SV9IgLbyiNQ'
	static RBF_CHANNEL_ID = 'UCKSWgpqi8BnNgDYh_jwYQNw'

	static VALID_YOUTUBE_CHANNEL_IDS: [string, string] = [Constants.SKC_CHANNEL_ID, Constants.RBF_CHANNEL_ID]
}