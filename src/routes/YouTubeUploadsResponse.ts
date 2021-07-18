type FormattedUploadResponse = {
	id: string
	title: string;
	description: string;
	publishedAt: string;
	thumbnailUrl: string;
	url: string;
}

export default class YouTubeUploadsResponse {
	readonly videos: [FormattedUploadResponse]
	readonly total: number

	constructor(videos: [FormattedUploadResponse], total: number)
	{
		this.videos = videos
		this.total = total
	}
}

export {FormattedUploadResponse}