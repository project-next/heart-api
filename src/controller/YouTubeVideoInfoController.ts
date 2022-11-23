import { NextFunction, Request, Response } from 'express'
import HeartAPIError from '../error/HeartAPIError.js'
import { AxiosError, AxiosResponse } from 'axios'
import YouTubeAxiosConfig from '../config/YouTubeAxiosConfig.js'
import { YouTubeAPIUploadsResponse, YouTubeUploadItem } from '../types/YouTubeAPIVideoTypes'
import { VideoInfoResponse } from '../types/HeartAPIYouTubeTypes'
import moize from 'moize'
import YouTubeAPIError from '../error/YouTubeAPIError.js'
import Constants from '../helper/Constants.js'

export default async function youTubeVideoInfoControllerCB(req: Request, res: Response, next: NextFunction) {
	let status: number
	let json: VideoInfoResponse | HeartAPIError

	if (req.query?.videoId == null) {
		next(new HeartAPIError(Constants.MISSING_REQUIRED_PARAM_MESSAGE, 400))
	} else {
		json = await memoizedYouTubeRequest(req.query.videoId as string)
		status = json! instanceof HeartAPIError ? json.code : 200

		if (json instanceof HeartAPIError) {
			next(json)
		} else {
			res.status(status).json(json)
		}
	}
}

const memoizedYouTubeRequest = moize(
	async (videoId: string): Promise<VideoInfoResponse | HeartAPIError> => {
		let json: VideoInfoResponse | HeartAPIError

		await YouTubeAxiosConfig.YOUTUBE_VIDEO_INFO_AXIOS_BASE_CONFIG.get('', {
			params: {
				id: videoId,
			},
		})
			.then((ytResponse: AxiosResponse<YouTubeAPIUploadsResponse>) => {
				json = ytResponse.data == null ? new HeartAPIError('YouTube API returned empty object', 500) : parseYouTubeResponse(ytResponse.data)
			})
			.catch((error: AxiosError) => (json = new YouTubeAPIError(error).convertYTErrorToHeartAPIError()))

		return json!
	},
	{ maxAge: 1000 * 60 * 10, updateExpire: false }
)

function parseYouTubeResponse(YouTubeAPIUploadsResponse: YouTubeAPIUploadsResponse): VideoInfoResponse {
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
