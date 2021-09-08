export default class HeartAPIError extends Error {
	constructor(private readonly desc: string, private readonly errCode: number) {
		super()
	}

	get description(): string {
		return this.desc
	}

	get code(): number {
		return this.errCode
	}
}