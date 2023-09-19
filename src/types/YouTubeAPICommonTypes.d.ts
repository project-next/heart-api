/**
 * Thumbnail info
 */
export type ThumbnailInfo = {
	url: string
	width: string
	height: string
}

export type Thumbnails = {
	default?: ThumbnailInfo
	medium?: ThumbnailInfo
	high?: ThumbnailInfo
	standard?: ThumbnailInfo
	maxres?: ThumbnailInfo
}

/**
 * Common top level object fields
 */
export type YouTubeAPIBaseResponse = {
	kind: string
	etag: string
	id?: string
	nextPageToken?: string
	pageInfo?: YoutubeAPIPageInfo
}

export type YoutubeAPIPageInfo = {
	totalResults: number
	resultsPerPage: number
}

/**
 * Common video object snippet fields
 */
export type YouTubeAPIBaseVideoSnippet = {
	title: string
	description: string
	publishedAt: string
	thumbnails: Thumbnails
}

/**
 * Errors
 */
export type YouTubeAPIGlobalError = {
	error: {
		errors: [
			{
				domain: string
				reason: string
				message: string
				locationType: string
				location: string
			}
		]
		code: number
		message: string
	}
}
