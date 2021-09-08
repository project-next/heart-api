export default class HeartAPIError extends Error {
	readonly description: string
	readonly code: number


	constructor(description: string, code: number) {
		super()
		this.description = description
		this.code = code
	}
}