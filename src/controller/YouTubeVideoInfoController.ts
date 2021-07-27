import { Request, Response } from 'express'
import Constants from '../service/Constants';
import HeartAPIError from '../error/HeartAPIError';
import { AxiosError, AxiosResponse } from 'axios';
import YouTubeAxiosConfig from '../service/YouTubeAxiosConfig';
import {VideoInfoResponse} from '../router/YouTubeVideoInfo'


type YouTubeAPIResponse = {
	kind: string,
	etag: string,
	items: YouTubeAPIResponseItem[],
	pageInfo: {
		totalResults: number,
		resultsPerPage: number
	}
}

type YouTubeAPIResponseItem = {
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


export default function YouTubeVideoInfoController(memoizedYouTubeRequest: (videoId: string) => Promise<AxiosResponse<YouTubeAPIResponse>>
		, getVideoInfoResponse: (youTubeAPIResponse: YouTubeAPIResponse) => VideoInfoResponse) {
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

export { YouTubeAPIResponse, YouTubeAPIResponseItem }