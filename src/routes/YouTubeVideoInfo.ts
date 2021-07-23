import { Router } from 'express'
import YouTubeAxiosConfig from '../downstream-services/YouTubeAxiosConfig'
import Endpoint from "./Endpoint"
import { AxiosResponse } from 'axios'
import moize from 'moize'
import YouTubeVideoInfoController, { YouTubeAPIResponse, YouTubeAPIResponseItem } from '../controller/YouTubeVideoInfoController'


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


export default class YouTubeVideoInfo implements Endpoint {
	readonly router = Router()


	constructor() {
		this.get()
	}


	get(): void {
		this.router.get('/yt/video/info', YouTubeVideoInfoController(this.memoizedYouTubeRequest, this.getVideoInfoResponse))
	}


	post(): void {
		throw new Error("Method not implemented.")
	}


	private memoizedYouTubeRequest = moize((videoId: string): Promise<AxiosResponse<YouTubeAPIResponse>> => {
		return this.getYoutubeRequest(videoId)
	}, { maxAge: 1000 * 60 * 3, updateExpire: false })


	private getYoutubeRequest = (videoId: string) => {
		return YouTubeAxiosConfig
			.YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG
			.get('/videos', {
				params: {
					id: videoId
				}
			})
	}


	private getVideoInfoResponse = (youTubeAPIResponse: YouTubeAPIResponse): VideoInfoResponse => {
		if (youTubeAPIResponse.items.length === 0)
			return {validVideo: false} as VideoInfoResponse


		const info: YouTubeAPIResponseItem = youTubeAPIResponse.items[0]

		return {
			validVideo: true,
			videoStats: {
				views: +info.statistics.viewCount,
				likes: +info.statistics.likeCount,
				dislikes: +info.statistics.dislikeCount,
				favorites: +info.statistics.favoriteCount,
				numComments: +info.statistics.commentCount
			}
		}
	}

}


export {YouTubeAPIResponse, VideoInfoResponse}