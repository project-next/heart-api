import { NextFunction, Request, Response } from 'express'
import YouTubeAxiosConfig from '../config/YouTubeAxiosConfig.js'
import Constants from '../helper/Constants.js'
import HeartAPIError from '../error/HeartAPIError.js'
import { AxiosError, AxiosResponse } from 'axios'
import sample from 'lodash.sample'
import { YouTubeAPIVideoCommentsResponse, YouTubeComment } from '../types/YouTubeAPIVideoTypes'
import { GiveawayInfo } from '../types/HeartAPIYouTubeTypes'
import YouTubeAPIError from '../error/YouTubeAPIError.js'

/**
 * Logic for YouTube giveaway endpoint.
 * @param object containing info on clients request.
 * @res object containing info used for response that will be sent to clients.
 */
export default async function youTubeGiveAwayControllerCB(req: Request, res: Response, next: NextFunction) {
	let json: GiveawayInfo | HeartAPIError
	let potentialWinners: YouTubeComment[] = []

	// get phrase and video id from clients request
	const GIVEAWAY_CODE = req.query.giveAwayCode?.toString()
	const VID_ID = req.query.videoId?.toString()

	if (VID_ID == null || GIVEAWAY_CODE == null) {
		next(new HeartAPIError(Constants.MISSING_REQUIRED_PARAM_MESSAGE, 400))
	} else {
		// retrieve all comments that use the giveaway phrase
		try {
			let nextPage = ''

			// will keep calling getGiveawayEntries() as long as there are comments to parse
			do {
				nextPage = await getGiveawayEntries(potentialWinners, GIVEAWAY_CODE, VID_ID, nextPage)
			} while (nextPage != '')
		} catch (err) {
			if (err instanceof HeartAPIError) {
				console.error('Error getting giveaway entries!')
				next(err)
				return
			}
		}

		// filter entries and get random winner
		const filteredPotentialWinners = filterPotentialWinners(potentialWinners)
		json = getRandomWinner(filteredPotentialWinners, GIVEAWAY_CODE)

		res.status(200).json(json)
	}
}

/**
 * Returns a Promise with entries/potential winners of a giveaway.
 * @param potentialWinners list of entries that used correct giveaway phrase.
 * @param giveAwayPhrase string used to denote which comments should be considered for the giveaway.
 * @param videoId which video the giveaway is valid for.
 * @param pageToken this value is non-null if there are more comments to parse. It is used to retrieve the "next page" of comments from the YouTube API.
 * @throws HeartAPIError if there is an error found when calling the YouTube API.
 * @returns the next page of comments or empty string if there are no further comments to parse.
 */
async function getGiveawayEntries(potentialWinners: YouTubeComment[], giveAwayPhrase: string, videoId: string, pageToken?: string): Promise<string> {
	const params =
		pageToken == null
			? {
					searchTerms: giveAwayPhrase,
					videoId: videoId,
			  }
			: {
					searchTerms: giveAwayPhrase,
					videoId: videoId,
					pageToken: pageToken,
			  }

	let nextPage = ''

	await YouTubeAxiosConfig.YOUTUBE_GIVE_AWAY_AXIOS_BASE_CONFIG.get('', {
		params: params,
	})
		.then(async (ytResponse: AxiosResponse) => {
			const response: YouTubeAPIVideoCommentsResponse = ytResponse.data as YouTubeAPIVideoCommentsResponse

			potentialWinners.push(...response.items) // add new entries to list

			if (response.nextPageToken != null) {
				nextPage = response.nextPageToken
			}
		})
		.catch((ytAPIError: AxiosError) => {
			throw new YouTubeAPIError(ytAPIError).convertYTErrorToHeartAPIError()
		})

	return nextPage
}

/**
 * Filter entries by the following:
 * 1) Accounts I own cannot enter giveaway.
 * 2) Only one YouTube account can enter.
 * @param list of entries that used correct giveaway phrase.
 * @returns modification of the input array containing only the items that pass through filters.
 */
function filterPotentialWinners(potentialWinners: readonly YouTubeComment[]): YouTubeComment[] {
	// remove comments that I might make - preventing me from winning my own giveaway 🥴
	potentialWinners = potentialWinners.filter(
		(potentialWinner) => !Constants.VALID_YOUTUBE_CHANNEL_IDS.includes(potentialWinner.snippet.topLevelComment.snippet.authorChannelId.value)
	)

	// Uses channel id as a unique identifier so a user can only "enter" once. This will prevent a user from making multiple comments to try to win.
	// Takes advantage of Map objects key uniqueness to save both the original entry information as the value and the channel id as the key.
	const uniqueEntries: Map<string, YouTubeComment> = new Map(
		potentialWinners.map((potentialWinner: YouTubeComment) => [potentialWinner.snippet.topLevelComment.snippet.authorChannelId.value, potentialWinner])
	)

	return Array.from(uniqueEntries.values())
}

/**
 * Creates body to return to client with the info of a random giveaway winner or basic info if no winner was found.
 * @param filteredPotentialWinners array containing potential winners that have been filtered before calling this method.
 * @param giveAwayPhrase the valid phrase users need to type in their comment to be considered as an entry for the giveaway.
 * @returns object the client will receive in the body.
 */
function getRandomWinner(filteredPotentialWinners: readonly YouTubeComment[], giveAwayPhrase: string): GiveawayInfo {
	if (filteredPotentialWinners.length === 0) {
		return {
			totalEntries: 0,
			entries: [],
			giveawayPhrase: giveAwayPhrase,
		}
	} else {
		const randomWinner = sample(filteredPotentialWinners)! // get random winner

		return {
			totalEntries: filteredPotentialWinners.length,
			entries: filteredPotentialWinners.map((comment: YouTubeComment) => {
				return comment.snippet.topLevelComment.snippet.authorDisplayName
			}),
			giveawayPhrase: giveAwayPhrase,
			winner: {
				name: randomWinner.snippet.topLevelComment.snippet.authorDisplayName,
				channel: randomWinner.snippet.topLevelComment.snippet.authorChannelUrl,
				winningComment: randomWinner.snippet.topLevelComment.snippet.textDisplay,
			},
		}
	}
}
