export default interface Question {
	id: string
	question: string
	answer: string | null
	related: string[] | null
	views: number
	created: number
}
