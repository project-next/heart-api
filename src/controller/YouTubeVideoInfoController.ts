import { Request, Response } from 'express'
import Constants from '../constants/Constants';
import HeartAPIError from '../error/HeartAPIError';
import { AxiosError, AxiosResponse } from 'axios';
import YouTubeAxiosConfig from '../service/YouTubeAxiosConfig';
import { VideoInfoResponse, YouTubeAPIResponse, YouTubeAPIResponseItem } from '../model/VideoInfoEndpointTypes'
import moize from 'moize'


export default function YouTubeVideoInfoController() {
	return async (req: Request, res: Response) => {
		let status: number
		let json: VideoInfoResponse | HeartAPIError

		if (req.query == null || req.query.key == null || req.query.videoId == null) {
			status = 400
			json = new HeartAPIError("Missing required query params.", status)
		} else if (req.query.key !== Constants.HEART_API_KEY) {
			status = 401
			json = new HeartAPIError("API key is incorrect.", status)
		} else {
			await memoizedYouTubeRequest(req.query.videoId as string)
				.then((ytResponse: AxiosResponse<YouTubeAPIResponse>) => {
					if (ytResponse.data == null) {
						status = 500
						json = new HeartAPIError("YouTube API returned empty object", status)
					} else {
						status = 200
						json = getVideoInfoResponse(ytResponse.data)
					}
				})
				.catch((error: AxiosError) => [status, json] = YouTubeAxiosConfig.youtubeAPIErrorCallback2(error))
		}

		res.status(status)
		res.json(json)
		res.send()
	}
}


const memoizedYouTubeRequest = moize((videoId: string): Promise<AxiosResponse<YouTubeAPIResponse>> => {
	return getYoutubeRequest(videoId)
}, { maxAge: 1000 * 60 * 3, updateExpire: false })


function getYoutubeRequest(videoId: string): Promise<AxiosResponse<YouTubeAPIResponse>> {
	return YouTubeAxiosConfig
		.YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG
		.get('/videos', {
			params: {
				id: videoId
			}
		})
}


function getVideoInfoResponse(youTubeAPIResponse: YouTubeAPIResponse): VideoInfoResponse {
	if (youTubeAPIResponse.items == null || youTubeAPIResponse.items.length === 0)
		return { validVideo: false } as VideoInfoResponse


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