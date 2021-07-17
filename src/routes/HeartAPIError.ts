export default class HeartAPIError {
	readonly description: string
	readonly code: number


	constructor(description: string, code: number)
	{
		this.description = description
		this.code = code
	}
}