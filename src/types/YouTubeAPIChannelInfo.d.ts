import { YouTubeAPIBaseResponse, YouTubeAPIBaseVideoSnippet } from './YouTubeAPICommonTypes.js'

export type YouTubeAPIChannelInfoResponse = YouTubeAPIBaseResponse & {
	items: YouTubeAPIChannelInfoItem[]
}

export type YouTubeAPIChannelInfoItem = YouTubeAPIBaseResponse & {
	snippet: YouTubeAPIChannelInfoItemSnippet
	contentDetails: YouTubeAPIChannelInfoItemContentDetails
	statistics: YouTubeAPIChannelInfoItemStats
}

export type YouTubeAPIChannelInfoItemSnippet = YouTubeAPIBaseVideoSnippet & {
	customUrl: string
	country: string
	localized: {
		title: string
		description: string
	}
}

export type YouTubeAPIChannelInfoItemContentDetails = {
	relatedPlaylists: {
		likes: string
		uploads: string
	}
}

export type YouTubeAPIChannelInfoItemStats = {
	viewCount: string
	subscriberCount: string
	hiddenSubscriberCount: boolean
	videoCount: string
}
