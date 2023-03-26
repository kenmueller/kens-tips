import 'server-only'

import Question from '.'

/** Questions are only stored while they are being loaded. */
export default class QuestionStore {
	static readonly shared = new QuestionStore()

	private readonly questionsById = new Map<string, Question>()
	private readonly questionsByName = new Map<string, Question>()

	private readonly listeners = new Map<string, ((value: unknown) => void)[]>()

	private constructor() {}

	readonly getQuestionById = (id: string) => this.questionsById.get(id) ?? null

	readonly getQuestionByName = (name: string) =>
		this.questionsByName.get(name) ?? null

	readonly addQuestion = (_question: Question) => {
		// Make a copy of the question so that it can be modified.
		const question = { ..._question }

		this.questionsById.set(question.id, question)
		this.questionsByName.set(question.question, question)
	}

	readonly getField = <Value>(id: string, field: string) =>
		new Promise<Value>(resolve => {
			this.listeners.set(`${id}.${field}`, [
				...(this.listeners.get(`${id}.${field}`) ?? []),
				resolve as (value: unknown) => void
			])
		})

	readonly addField = <Value>(id: string, field: string, value: Value) => {
		const listeners = this.listeners.get(`${id}.${field}`)

		listeners?.forEach(listener => listener(value))

		const question = this.getQuestionById(id)
		if (question)
			(question as unknown as Record<string, unknown>)[field] = value

		if (listeners) this.listeners.delete(`${id}.${field}`)
	}

	readonly getAnswer = (id: string) => this.getField<string>(id, 'answer')
	readonly addAnswer = (id: string, answer: string) =>
		this.addField(id, 'answer', answer)

	readonly getRelatedQuestions = (id: string) =>
		this.getField<string[]>(id, 'related')
	readonly addRelatedQuestions = (id: string, related: string[]) =>
		this.addField(id, 'related', related)

	readonly removeQuestion = (id: string) => {
		const question = this.getQuestionById(id)
		if (!question) return

		this.questionsById.delete(question.id)
		this.questionsByName.delete(question.question)
	}
}
