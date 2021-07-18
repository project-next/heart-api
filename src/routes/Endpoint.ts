import { Router } from "express"

export default interface Endpoint
{
	readonly router: Router
	get(): void
	post(): void
}