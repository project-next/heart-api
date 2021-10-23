import { Request, Response } from 'express'
import HeartAPIError from '@error/HeartAPIError'
import { AxiosError, AxiosResponse } from 'axios'
import YouTubeAxiosConfig from '@config/YouTubeAxiosConfig'
import { VideoInfoResponse, YouTubeAPIResponse, YouTubeAPIResponseItem } from '../types/YouTubeVideoInfoTypes'
import moize from 'moize'
import YouTubeAPIError from '@error/YouTubeAPIError'
import Constants from '@helper/Constants'


export default async function youTubeVideoInfoControllerCB(req: Request, res: Response) {
	let status: number
	let json: VideoInfoResponse | HeartAPIError

	if (req.query?.videoId == null) {
		status = 400
		json = new HeartAPIError(Constants.MISSING_REQUIRED_PARAM_MESSAGE, status)
	} else {
		json = await memoizedYouTubeRequest(req.query.videoId as string)
		status = (json! instanceof HeartAPIError)? json.code : 200
	}

	res.status(status!)
	res.json(json!)
	res.end()
}


const memoizedYouTubeRequest = moize(async (videoId: string): Promise<VideoInfoResponse | HeartAPIError> => {
	let json: VideoInfoResponse | HeartAPIError

	await YouTubeAxiosConfig
		.YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG
		.get('', {
			params: {
				id: videoId
			}
		})
		.then((ytResponse: AxiosResponse<YouTubeAPIResponse>) => {
			json = (ytResponse.data == null)? new HeartAPIError("YouTube API returned empty object", 500) : getVideoInfoResponse(ytResponse.data)
		})
		.catch((error: AxiosError) => json = new YouTubeAPIError(error).convertYTErrorToHeartAPIError())

	return json!
}, { maxAge: 1000 * 60 * 10, updateExpire: false })


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