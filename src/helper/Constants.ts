export default class Constants {
	static readonly YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3'
	static readonly YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
	static readonly HEART_API_KEY = process.env.HEART_API_KEY

	static readonly HEART_API_DB_BASE_URI = process.env.HEART_API_DB_BASE_URI

	static readonly SKC_CHANNEL_ID = 'UCBZ_1wWyLQI3SV9IgLbyiNQ'
	static readonly RBF_CHANNEL_ID = 'UCKSWgpqi8BnNgDYh_jwYQNw'
	static readonly BTSC_CHANNEL_ID = 'UCu0LlZ527i4NcXNhru67D1Q'

	static readonly VALID_YOUTUBE_CHANNEL_IDS: string[] = [Constants.SKC_CHANNEL_ID, Constants.RBF_CHANNEL_ID, Constants.BTSC_CHANNEL_ID]

	static readonly MISSING_REQUIRED_PARAM_MESSAGE = 'Missing required query params'
}
