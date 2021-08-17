import { Request, Response } from 'express'
import YouTubeAxiosConfig from '../config/YouTubeAxiosConfig'
import Constants from '../helper/Constants'
import HeartAPIError from '../error/HeartAPIError'
import { AxiosResponse } from 'axios'
import sample from 'lodash.sample'
import { YouTubeAPIResponse, YouTubeAPIResponseItem, GiveAwayInfo } from '../types/YouTubeGiveAwayTypes'


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
			json = await getGiveAwayWinner([] as YouTubeAPIResponseItem[], req.query.giveAwayCode.toString(), req.query.videoId.toString())
			status = 200
		}

		res.status(status!)
		res.json(json!)
		res.send()
	}
}


async function getGiveAwayWinner(potentialWinners: YouTubeAPIResponseItem[], code: string, videoId: string, pageToken?: string): Promise<GiveAwayInfo | HeartAPIError> {
	const params = (pageToken == null)? {
		searchTerms: code
		, videoId: videoId
	} : {
		searchTerms: code
		, videoId: videoId
		, pageToken: pageToken
	}

	let winner: GiveAwayInfo | HeartAPIError

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
				winner = await getGiveAwayWinner(potentialWinners, code, videoId, pageToken)
			} else {
				const filteredPotentialWinners = filterPotentialWinners(potentialWinners)
				winner = getRandomWinner(filteredPotentialWinners, code)
			}
		})
		// .catch((error: AxiosError) => YouTubeAxiosConfig.youtubeAPIErrorCallback(error, res))

		return winner!
}


function filterPotentialWinners(potentialWinners: YouTubeAPIResponseItem[]): YouTubeAPIResponseItem[] {
	potentialWinners = potentialWinners
		.filter(
			potentialWinner => !(Constants.VALID_YOUTUBE_CHANNEL_IDS.includes(potentialWinner.snippet.topLevelComment.snippet.authorChannelId.value))
		)

	const unique: Map<string, YouTubeAPIResponseItem> = new Map(potentialWinners.map((potentialWinner: YouTubeAPIResponseItem) => [potentialWinner.snippet.topLevelComment.snippet.authorChannelId.value, potentialWinner]))

	return Array.from(unique.values())
}


function getRandomWinner(filteredPotentialWinners: readonly YouTubeAPIResponseItem[], code: string) {
	if (filteredPotentialWinners.length === 0) {
		return {
			totalEntries: 0
			, code: code
		}
	} else {
		const randomWinner = sample(filteredPotentialWinners)!	// random winner

		return {
			totalEntries: filteredPotentialWinners.length
			, code: code
			, winner: {
				name: randomWinner.snippet.topLevelComment.snippet.authorDisplayName
				, channel: randomWinner.snippet.topLevelComment.snippet.authorChannelUrl
				, winningComment: randomWinner.snippet.topLevelComment.snippet.textDisplay
			}
		}
	}
}
