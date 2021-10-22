export type YouTubeVideo = {
	kind: string
	etag: string
	id: string
	snippet: {
		publishedAt: string;
		channelId: string,
		title: string,
		description: string,
		thumbnails: {
			default: {
				url: string
				width: string
				height: string
			}
			medium: {
				url: string
				width: string
				height: string
			}
			high: {
				url: string
				width: string
				height: string
			}
			standard: {
				url: string
				width: string
				height: string
			}
			maxres: {
				url: string
				width: string
				height: string
			}
		}
		channelTitle: string
		type: string
	}
	contentDetails: {
		upload: {
			videoId: string
		}
	}
}


export type YouTubeVideoUploadsEndpointResponse = {
	kind: string
	etag: string,
	items: YouTubeVideo[]
}