import { Request, Response } from 'express'
import YouTubeAxiosConfig from '../service/YouTubeAxiosConfig'
import Constants from '../constants/Constants'
import HeartAPIError from '../error/HeartAPIError'
import { AxiosError, AxiosResponse } from 'axios'
import sample from 'lodash.sample'
import { YouTubeAPIResponse, YouTubeAPIResponseItem, GiveAwayInfo } from '../model/GiveAwayEndpointTypes'


export default function YouTubeGiveAwayController() {
	return async (req: Request, res: Response) => {
		let status: number
		let json: GiveAwayInfo | HeartAPIError

		if (req.query == null || req.query.key == null || req.query.videoId == null || req.query.giveAwayCode == null) {
			status = 400
			json = new HeartAPIError("Missing required query params.", status)
		} else if (req.query.key !== Constants.HEART_API_KEY) {
			let status = 401
			new HeartAPIError("API key is incorrect.", status)
		} else {
			json = await getGiveAwayWinner([] as YouTubeAPIResponseItem[], req.query.giveAwayCode.toString(), req.query.videoId.toString(), null)
			status = 200
		}

		res.status(status)
		res.json(json)
		res.send()
	}
}


async function getGiveAwayWinner(potentialWinners: YouTubeAPIResponseItem[], code: string, videoId: string, pageToken: string): Promise<GiveAwayInfo> {
	const params = (pageToken == null)? {
		searchTerms: code
		, videoId: videoId
	} : {
		searchTerms: code
		, videoId: videoId
		, pageToken: pageToken
	}

	let winner: GiveAwayInfo

	await YouTubeAxiosConfig
		.YOUTUBE_GIVE_AWAY_AXIOS_BASE_CONFIG
		.get('/commentThreads', {
			params: params
		})
		.then(async (ytResponse: AxiosResponse) => {
			const response: YouTubeAPIResponse = ytResponse.data

			potentialWinners.push(...response.items)
			pageToken = response.nextPageToken

			if (pageToken != null) {
				console.log('xxxx')
				winner = await getGiveAwayWinner(potentialWinners, code, videoId, pageToken)
			} else {
				// filtering out my channels as I cannot win giveaways
				potentialWinners = potentialWinners.filter(
					potentialWinner => !(Constants.VALID_YOUTUBE_CHANNEL_IDS.includes(potentialWinner.snippet.topLevelComment.snippet.authorChannelId.value))
				)

				if (potentialWinners.length === 0){
					winner = {
						totalEntries: 0
						, code: code
						, winner: undefined
					} as GiveAwayInfo
				} else {
					const winner = sample(potentialWinners)	// random winner

					winner = {
						totalEntries: potentialWinners.length
						, code: code
						, winner: {
							name: winner.snippet.topLevelComment.snippet.authorDisplayName
							, channel: winner.snippet.topLevelComment.snippet.authorChannelUrl
							, winningComment: winner.snippet.topLevelComment.snippet.textDisplay
						}
					} as GiveAwayInfo
				}
			}

		})
		// .catch((error: AxiosError) => YouTubeAxiosConfig.youtubeAPIErrorCallback(error, res))

		return winner
}