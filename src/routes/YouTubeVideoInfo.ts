import { Router, Request, Response } from 'express'
import YouTubeAxiosConfig from '../downstream-services/YouTubeAxiosConfig';
import Constants from '../downstream-services/Constants';
import Endpoint from "./Endpoint";
import HeartAPIError from '../errors/HeartAPIError';
import { AxiosError, AxiosResponse } from 'axios';
import moize from 'moize';


type YouTubeAPIResponse = {
	kind: string,
	etag: string,
	items: YouTubeAPIResponseItem[],
	pageInfo: {
		totalResults: number,
		resultsPerPage: number
	}
}

type YouTubeAPIResponseItem =
	{
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
		this.router.get('/yt/video/info', (req: Request, res: Response) => {
			let status = 200
			if (req.query == null || req.query.key == null || req.query.videoId == null) {
				status = 400

				res.status(status)
				res.json(new HeartAPIError("Missing required query params.", status))
				res.send()
			} else if (req.query.key !== Constants.HEART_API_KEY) {
				let status = 401

				res.status(status)
				res.json(new HeartAPIError("API key is incorrect.", status))
				res.send()
			} else {
				this.memoizedYouTubeRequest(req.query.videoId as string)
					.then((ytResponse: AxiosResponse<YouTubeAPIResponse>) => {
						res.status(status)
						res.json(this.getVideoInfoResponse(ytResponse.data))
						res.send()
					})
					.catch((error: AxiosError) => YouTubeAxiosConfig.YOUTUBE_API_ERROR_CALLBACK(error, res))
			}
		})
	}


	post(): void {
		throw new Error("Method not implemented.");
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