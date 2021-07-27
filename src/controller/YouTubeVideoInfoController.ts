import { Request, Response } from 'express'
import Constants from '../constants/Constants';
import HeartAPIError from '../error/HeartAPIError';
import { AxiosError, AxiosResponse } from 'axios';
import YouTubeAxiosConfig from '../service/YouTubeAxiosConfig';
import { VideoInfoResponse, YouTubeAPIResponse, YouTubeAPIResponseItem } from '../model/VideoInfoEndpointTypes'
import moize from 'moize'


export default function YouTubeVideoInfoController() {
	return (req: Request, res: Response) => {
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
			memoizedYouTubeRequest(req.query.videoId as string)
				.then((ytResponse: AxiosResponse<YouTubeAPIResponse>) => {
					res.status(status)
					res.json(getVideoInfoResponse(ytResponse.data))
					res.send()
				})
				.catch((error: AxiosError) => YouTubeAxiosConfig.youtubeAPIErrorCallback(error, res))
		}
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
	if (youTubeAPIResponse.items.length === 0)
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