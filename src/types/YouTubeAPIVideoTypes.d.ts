import { YouTubeAPIBaseResponse, YouTubeAPIBaseVideoSnippet } from './YouTubeAPICommonTypes.js'

export type YouTubeAPIVideoCommentsResponse = YouTubeAPIBaseResponse & {
	items: YouTubeComment[]
}

export type YouTubeComment = YouTubeAPIBaseResponse & {
	snippet: {
		videoId: string
		topLevelComment: YouTubeAPIBaseResponse & {
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

export type YouTubeAPIUploadsResponse = YouTubeAPIBaseResponse & {
	items: YouTubeUploadItem[]
}

export type YouTubeUploadItem = YouTubeAPIBaseResponse & {
	statistics: {
		viewCount: string
		likeCount: string
		dislikeCount: string
		favoriteCount: string
		commentCount: string
	}
}

export type YouTubeVideo = YouTubeAPIBaseResponse & {
	snippet: YouTubeAPIBaseVideoSnippet & {
		channelId: string
		channelTitle: string
		liveBroadcastContent: string
		publishTime: string
		resourceId: {
			kind: string
			videoId: string
		}
	}
}

export type YouTubeVideoUploadsEndpointResponse = YouTubeAPIBaseResponse & {
	items: YouTubeVideo[]
}
