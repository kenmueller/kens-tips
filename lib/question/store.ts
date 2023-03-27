import 'server-only'

import { DatabasePoolConnection } from 'slonik'

import Question from '.'
import getQuestionByName from './getByName'
import getDefaultQuestion from './default'

/** Questions are only stored while they are being loaded. */
export default class QuestionStore {
	static readonly shared = new QuestionStore()

	private readonly questionsById = new Map<string, Question>()
	private readonly questionsByName = new Map<string, Promise<Question>>()

	private readonly listeners = new Map<string, ((value: unknown) => void)[]>()

	readonly getQuestionById = (id: string) => this.questionsById.get(id) ?? null

	readonly getQuestionByName = (name: string) =>
		this.questionsByName.get(name) ?? Promise.resolve(null)

	private readonly loadQuestion = async (
		name: string,
		connection?: DatabasePoolConnection
	) => {
		const questionInDatabase = await getQuestionByName(name, connection)

		return {
			question: questionInDatabase ?? getDefaultQuestion(name),
			questionInDatabase: Boolean(questionInDatabase)
		}
	}

	readonly addQuestion = (
		name: string,
		connection?: DatabasePoolConnection
	) => {
		const promise = this.loadQuestion(name, connection)

		promise.then(({ question }) => {
			this.questionsById.set(question.id, question)
		})

		this.questionsByName.set(
			name,
			promise.then(({ question }) => question)
		)

		return promise
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

		listeners?.forEach(listener => {
			listener(value)
		})

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
