import { Request, Response } from 'express'
import YouTubeAxiosConfig from '@config/YouTubeAxiosConfig'
import Constants from '@helper/Constants'
import HeartAPIError from '@error/HeartAPIError'
import { AxiosError, AxiosResponse } from 'axios'
import sample from 'lodash.sample'
import { YouTubeAPIResponse, YouTubeAPIResponseItem, GiveawayInfo } from '../types/YouTubeGiveAwayTypes'
import YouTubeAPIError from '@error/YouTubeAPIError'


/**
 * Logic for YouTube giveaway endpoint.
 * @returns Express compliant call back containing endpoint specific functionality.
 */
export default async function youTubeGiveAwayControllerCB(req: Request, res: Response) {
	let status: number
	let json: GiveawayInfo | HeartAPIError

	if (req.query?.videoId == null || req.query?.giveAwayCode == null) {
		status = 400
		json = new HeartAPIError(Constants.MISSING_REQUIRED_PARAM_MESSAGE, status)
	} else {
		try {
			let potentialWinners: YouTubeAPIResponseItem[] = []
			let hasMoreEntries: boolean

			do {
				hasMoreEntries = await getGiveAwayWinner(potentialWinners, req.query.giveAwayCode.toString(), req.query.videoId.toString())
			} while(hasMoreEntries)

			const filteredPotentialWinners = filterPotentialWinners(potentialWinners)
			json = getRandomWinner(filteredPotentialWinners, req.query.giveAwayCode.toString())
		} catch(err) {
			json = err as HeartAPIError
		}

		status = (json instanceof HeartAPIError)? json.code : 200
	}

	res.status(status!)
	res.json(json)
	res.end()
}


/**
 * Returns a Promise with either Giveaway info if no exception occurred or Error info if YouTube API returned with an Error or other Error occurred.
 * @param potentialWinners YouTube API output
 * @param giveAwayPhrase
 * @param videoId
 * @param pageToken
 * @returns
 */
async function getGiveAwayWinner(potentialWinners: YouTubeAPIResponseItem[], giveAwayPhrase: string
	, videoId: string, pageToken?: string): Promise<boolean> {
	const params = (pageToken == null)? {
		searchTerms: giveAwayPhrase
		, videoId: videoId
	} : {
		searchTerms: giveAwayPhrase
		, videoId: videoId
		, pageToken: pageToken
	}

	let hasMoreEntries: boolean = false
	let heartAPIError: HeartAPIError | undefined = undefined

	await YouTubeAxiosConfig
		.YOUTUBE_GIVE_AWAY_AXIOS_BASE_CONFIG
		.get('', {
			params: params
		})
		.then(async (ytResponse: AxiosResponse) => {
			const response: YouTubeAPIResponse = ytResponse.data as YouTubeAPIResponse

			potentialWinners.push(...response.items)

			if (response.nextPageToken != null) {
				hasMoreEntries = true
			}
		})
		.catch((ytAPIError: AxiosError) => {
			heartAPIError = new YouTubeAPIError(ytAPIError).convertYTErrorToHeartAPIError()
		})

		if (heartAPIError != null)
			throw heartAPIError
		return hasMoreEntries!
}


/**
 * Filter entries by the following:
 * 1) Accounts I own cannot enter giveaway.
 * 2) Only one YouTube account can enter.
 * @param potentialWinners array containing potential winners.
 * @returns modification of the input array containing only the items that pass through filters.
 */
function filterPotentialWinners(potentialWinners: YouTubeAPIResponseItem[]): YouTubeAPIResponseItem[] {
	// remove comments that I might make - preventing me from winning my own giveaway 🥴
	potentialWinners = potentialWinners
		.filter(
			potentialWinner => !(Constants.VALID_YOUTUBE_CHANNEL_IDS.includes(potentialWinner.snippet.topLevelComment.snippet.authorChannelId.value))
		)

	/*
		Uses channel id as a unique identifier so a user can only "enter" once. This will prevent a user from making multiple comments to try to win.
		Takes advantage of Map objects key uniqueness to save both the original entry information as the value and the channel id as the key.
	*/
	const uniqueEntries: Map<string, YouTubeAPIResponseItem> = new Map(
		potentialWinners
			.map((potentialWinner: YouTubeAPIResponseItem) => [potentialWinner.snippet.topLevelComment.snippet.authorChannelId.value, potentialWinner])
	)

	return Array.from(uniqueEntries.values())
}


/**
 * Creates body to return to client with the info of a random giveaway winner or basic info if no winner was found.
 * @param filteredPotentialWinners array containing potential winners that have been filtered before calling this method.
 * @param giveAwayPhrase the valid phrase users need to type in their comment to be considered as an entry for the giveaway.
 * @returns object the client will receive in the body.
 */
function getRandomWinner(filteredPotentialWinners: readonly YouTubeAPIResponseItem[], giveAwayPhrase: string): GiveawayInfo {
	if (filteredPotentialWinners.length === 0) {
		return {
			totalEntries: 0
			, giveawayPhrase: giveAwayPhrase
		}
	} else {
		const randomWinner = sample(filteredPotentialWinners)!	// get random winner

		return {
			totalEntries: filteredPotentialWinners.length
			, giveawayPhrase: giveAwayPhrase
			, winner: {
				name: randomWinner.snippet.topLevelComment.snippet.authorDisplayName
				, channel: randomWinner.snippet.topLevelComment.snippet.authorChannelUrl
				, winningComment: randomWinner.snippet.topLevelComment.snippet.textDisplay
			}
		}
	}
}
