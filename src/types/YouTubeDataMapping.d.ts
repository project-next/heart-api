export type GiveawayInfo = {
	totalEntries: number
	entries: string[]
	giveawayPhrase: string
	winner?: {
		name: string
		channel: string
		winningComment: string
	}
}

export type VideoInfoResponse = {
	validVideo: boolean
	videoStats: {
		views: number
		likes: number
		dislikes: number
		favorites: number
		numComments: number
	}
}

export type FormattedUploadResponse = {
	id: string
	title: string
	description: string
	publishedAt: string
	thumbnailUrl: string
	url: string
}

export type YouTubeUploadsResponse = {
	videos: FormattedUploadResponse[]
	total: number
}
