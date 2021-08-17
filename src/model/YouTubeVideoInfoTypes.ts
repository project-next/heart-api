type VideoInfoResponse = {
	validVideo: boolean
	videoStats: {
		views: number,
		likes: number,
		dislikes: number,
		favorites: number,
		numComments: number
	}
}

type YouTubeAPIResponse = {
	kind: string,
	etag: string,
	items: YouTubeAPIResponseItem[],
	pageInfo: {
		totalResults: number,
		resultsPerPage: number
	}
}

type YouTubeAPIResponseItem = {
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

export { VideoInfoResponse, YouTubeAPIResponse, YouTubeAPIResponseItem }