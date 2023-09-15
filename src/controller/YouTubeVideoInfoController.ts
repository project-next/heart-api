import { NextFunction, Request, Response } from 'express'
import moize from 'moize'
import HeartAPIError from '../error/HeartAPIError.js'
import { AxiosError, AxiosResponse } from 'axios'
import YouTubeAxiosConfig from '../config/YouTubeAxiosConfig.js'
import { YouTubeAPIUploadsResponse, YouTubeUploadItem } from '../types/YouTubeAPIVideoTypes'
import { VideoInfoResponse } from '../types/HeartAPIYouTubeTypes'
import YouTubeAPIError from '../error/YouTubeAPIError.js'
import Constants from '../helper/Constants.js'

export default async function youTubeVideoInfoControllerCB(req: Request, res: Response, next: NextFunction) {
	if (req.query?.videoId == null) {
		next(new HeartAPIError(Constants.MISSING_REQUIRED_PARAM_MESSAGE, 400))
		return
	}

	const json = await memoizedYouTubeRequest(req.query.videoId as string)
	if (json instanceof HeartAPIError) {
		next(json)
		return
	}
	res.status(200).json(json)
}

const memoizedYouTubeRequest = moize(
	async (videoId: string): Promise<VideoInfoResponse | HeartAPIError> => {
		return await YouTubeAxiosConfig.YOUTUBE_VIDEO_INFO_AXIOS_CONFIG.get('', {
			params: {
				id: videoId,
			},
		})
			.then((ytResponse: AxiosResponse<YouTubeAPIUploadsResponse>) => {
				if (ytResponse.data == null) {
					console.error(`Received empty body from /videos endpoint when using video ID ${videoId}`)
					return new HeartAPIError('YT API returned empty object', 500)
				}
				return parseYouTubeResponse(ytResponse.data)
			})
			.catch((error: AxiosError) => {
				console.error(`YT API returned with error when calling /videos endpoint with video ID ${videoId}`)
				return new YouTubeAPIError(error).convertYTErrorToHeartAPIError()
			})
	},
	{ maxAge: 1000 * 60 * 10 }
)

const parseYouTubeResponse = (YouTubeAPIUploadsResponse: YouTubeAPIUploadsResponse): VideoInfoResponse => {
	if (YouTubeAPIUploadsResponse.items == null || YouTubeAPIUploadsResponse.items.length === 0) return { validVideo: false } as VideoInfoResponse
	const info: YouTubeUploadItem = YouTubeAPIUploadsResponse.items[0]

	return {
		validVideo: true,
		videoStats: {
			views: +info.statistics.viewCount,
			likes: +info.statistics.likeCount,
			dislikes: +info.statistics.dislikeCount,
			favorites: +info.statistics.favoriteCount,
			numComments: +info.statistics.commentCount,
		},
	}
}
