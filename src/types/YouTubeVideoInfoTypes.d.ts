export type VideoInfoResponse = {
	validVideo: boolean
	videoStats: {
		views: number,
		likes: number,
		dislikes: number,
		favorites: number,
		numComments: number
	}
}

export type YouTubeAPIResponse = {
	kind: string,
	etag: string,
	items: YouTubeAPIResponseItem[],
	pageInfo: {
		totalResults: number,
		resultsPerPage: number
	}
}

export type YouTubeAPIResponseItem = {
	kind: string,
	etag: string,
	id: string,
	statistics: {
		viewCount: string,
		likeCount: string,
		dislikeCount: string,
		favoriteCount: string,
		commentCount: string
	}
}