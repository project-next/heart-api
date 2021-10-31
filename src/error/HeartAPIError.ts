export default class HeartAPIError extends Error {
	constructor(public readonly description: string, public readonly code: number) {
		super()
	}
}