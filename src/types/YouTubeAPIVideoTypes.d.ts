export type YouTubeAPIVideoCommentsResponse = {
	kind: string
	etag: string
	nextPageToken: string
	pageInfo: {
		totalResults: number
		resultsPerPage: number
	}
	items: YouTubeComment[]
}

export type YouTubeComment = {
	kind: string
	etag: string
	id: string
	snippet: {
		videoId: string
		topLevelComment: {
			kind: string
			etag: string
			id: string
			snippet: {
				videoId: string
				textDisplay: string
				textOriginal: string
				authorDisplayName: string
				authorProfileImageUrl: string
				authorChannelUrl: string
				authorChannelId: {
					value: string
				}
				canRate: boolean
				viewerRating: string
				likeCount: number
				publishedAt: string
				updatedAt: string
			}
		}
		canReply: boolean
		totalReplyCount: number
		isPublic: boolean
	}
}

export type YouTubeAPIUploadsResponse = {
	kind: string
	etag: string
	items: YouTubeUploadItem[]
	pageInfo: {
		totalResults: number
		resultsPerPage: number
	}
}

export type YouTubeUploadItem = {
	kind: string
	etag: string
	id: string
	statistics: {
		viewCount: string
		likeCount: string
		dislikeCount: string
		favoriteCount: string
		commentCount: string
	}
}
export type ThumbnailInfo = {
	url: string
	width: string
	height: string
}

export type YouTubeVideo = {
	kind: string
	etag: string
	id: string
	snippet: {
		publishedAt: string
		channelId: string
		title: string
		description: string
		thumbnails: {
			default: ThumbnailInfo | undefined
			medium: ThumbnailInfo | undefined
			high: ThumbnailInfo | undefined
			standard: ThumbnailInfo | undefined
			maxres: ThumbnailInfo | undefined
		}
		channelTitle: string
		liveBroadcastContent: string
		publishTime: string
		resourceId: {
			kind: string
			videoId: string
		}
	}
}

export type YouTubeVideoUploadsEndpointResponse = {
	kind: string
	etag: string
	nextPageToken: string
	items: YouTubeVideo[]
}
