import { ThumbnailInfo } from './YouTubeAPIVideoTypes.js'

export type YouTubeAPIChannelInfoResponse = {
	kind: string
	etag: string
	items: YouTubeAPIChannelInfoItem[]
}

export type YouTubeAPIChannelInfoItem = {
	kind: string
	etag: string
	id: string
	snippet: YouTubeAPIChannelInfoItemSnippet
	contentDetails: YouTubeAPIChannelInfoItemContentDetails
	statistics: YouTubeAPIChannelInfoItemStats
}

export type YouTubeAPIChannelInfoItemSnippet = {
	title: string
	description: string
	customUrl: string
	publishedAt: string
	thumbnails: {
		default: ThumbnailInfo | undefined
		medium: ThumbnailInfo | undefined
		high: ThumbnailInfo | undefined
	}
	localized: {
		title: string
		description: string
	}
	country: string
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
