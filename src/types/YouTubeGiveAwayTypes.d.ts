export type YouTubeAPIResponse = {
   kind: string,
   etag: string,
   nextPageToken: string,
   pageInfo: {
      totalResults: number,
      resultsPerPage: number
   },
   items: YouTubeAPIResponseItem[]
}

export type YouTubeAPIResponseItem = {
	kind: string,
	etag: string,
	id: string,
	snippet: {
		videoId: string,
		topLevelComment: {
			kind: string,
			etag: string,
			id: string,
			snippet: {
				videoId: string,
				textDisplay: string,
				textOriginal: string,
				authorDisplayName: string,
				authorProfileImageUrl: string,
				authorChannelUrl: string,
				authorChannelId: {
					value: string
				},
				canRate: boolean,
				viewerRating: string,
				likeCount: number,
				publishedAt: string,
				updatedAt: string
			}
		},
		canReply: boolean,
		totalReplyCount: number,
		isPublic: boolean
	}
}


export type GiveawayInfo = {
	totalEntries: number
	, giveawayPhrase: string
	, winner?: {
		name: string
		, channel: string
		, winningComment: string
	}
}