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

export {VideoInfoResponse}