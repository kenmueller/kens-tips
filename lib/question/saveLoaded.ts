import 'server-only'

import { DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import loadQuestionByName from './loadByName'
import Model from '@/lib/openai/model'

const saveLoadedQuestions = async (names: string[], model?: Model) =>
	await connect(connection =>
		Promise.all(names.map(name => saveLoadedQuestion(name, model, connection)))
	)

const saveLoadedQuestion = async (
	name: string,
	model: Model | undefined,
	connection: DatabasePoolConnection
) => {
	const { question, answer, relatedQuestions, saveResult } =
		await loadQuestionByName(name, model, connection)

	const [answerUnwrapped, relatedQuestionsUnwrapped] = await Promise.all([
		answer,
		relatedQuestions,
		saveResult
	])

	return {
		...question,
		answer: answerUnwrapped,
		related: relatedQuestionsUnwrapped
	}
}

export default saveLoadedQuestions
