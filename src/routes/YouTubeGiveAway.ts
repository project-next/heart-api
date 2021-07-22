import { Router, Request, Response } from 'express'
import YouTubeAxiosConfig from '../downstream-services/YouTubeAxiosConfig';
import Constants from '../downstream-services/Constants';
import Endpoint from "./Endpoint";
import HeartAPIError from '../errors/HeartAPIError';
import { AxiosError, AxiosResponse } from 'axios';
import sample from 'lodash.sample'


type YouTubeAPIResponse = {
   kind: string,
   etag: string,
   nextPageToken: string,
   pageInfo: {
      totalResults: number,
      resultsPerPage: number
   },
   items: [
      {
         kind: string,
         etag: string,
         id: string,
         snippet: {
            videoId: string,
            topLevelComment: {
               kind: string,
               etag: string,
               id: string,
               snippet: {
                  videoId: string,
                  textDisplay: string,
                  textOriginal: string,
                  authorDisplayName: string,
                  authorProfileImageUrl: string,
                  authorChannelUrl: string,
                  authorChannelId: {
                     value: string
                  },
                  canRate: boolean,
                  viewerRating: string,
                  likeCount: number,
                  publishedAt: string,
                  updatedAt: string
               }
            },
            canReply: boolean,
            totalReplyCount: number,
            isPublic: boolean
         }
      }
   ]
}

type YouTubeAPIResponseItem = {
	kind: string,
	etag: string,
	id: string,
	snippet: {
		videoId: string,
		topLevelComment: {
			kind: string,
			etag: string,
			id: string,
			snippet: {
				videoId: string,
				textDisplay: string,
				textOriginal: string,
				authorDisplayName: string,
				authorProfileImageUrl: string,
				authorChannelUrl: string,
				authorChannelId: {
					value: string
				},
				canRate: boolean,
				viewerRating: string,
				likeCount: number,
				publishedAt: string,
				updatedAt: string
			}
		},
		canReply: boolean,
		totalReplyCount: number,
		isPublic: boolean
	}
}


type GiveAwayInfo = {
	totalEntries: number
	, code: string
	, winner: {
		name: string
		, channel: string
		, winningComment: string
	}
}


export default class YouTubeGiveAway implements Endpoint {
	readonly router = Router()


	constructor() {
		this.get()
	}


	get(): void {
		this.router.get('/yt/video/give-away', (req: Request, res: Response) => {
			let status = 200

			if (req.query == null || req.query.key == null || req.query.videoId == null || req.query.giveAwayCode == null) {
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
				this.getGiveAwayWinner([]as YouTubeAPIResponseItem[], req.query.giveAwayCode.toString(), req.query.videoId.toString(), null, res)
			}
		})
	}


	post(): void {
		throw new Error("Method not implemented.");
	}


	private getGiveAwayWinner = (info: YouTubeAPIResponseItem[], code: string, videoId: string, pageToken: string, res: Response): void => {
		const params = (pageToken == null)? {
			searchTerms: code
			, videoId: videoId
		} : {
			searchTerms: code
			, videoId: videoId
			, pageToken: pageToken
		}

		YouTubeAxiosConfig
			.YOUTUBE_GIVE_AWAY_AXIOS_BASE_CONFIG
			.get('/commentThreads', {
				params: params
			})
			.then((ytResponse: AxiosResponse) => {
				const response: YouTubeAPIResponse = ytResponse.data

				info.push(...response.items)
				pageToken = response.nextPageToken

				if (pageToken != null) {
					this.getGiveAwayWinner(info, code, videoId, pageToken, res)
				} else {
					const winner = sample(info)

					const giveAwayInfo: GiveAwayInfo = {
						totalEntries: info.length
						, code: code
						, winner: {
							name: winner.snippet.topLevelComment.snippet.authorDisplayName
							, channel: winner.snippet.topLevelComment.snippet.authorChannelUrl
							, winningComment: winner.snippet.topLevelComment.snippet.textDisplay
						}
					}

					res.status(200)
					res.json({'giveAwayInfo': giveAwayInfo})
					res.send()
				}
			})
			.catch((error: AxiosError) => YouTubeAxiosConfig.YOUTUBE_API_ERROR_CALLBACK(error, res))
	}
}