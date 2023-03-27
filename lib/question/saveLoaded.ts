import 'server-only'

import { DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import loadQuestionByName from './loadByName'

const saveLoadedQuestions = async (names: string[]) =>
	await connect(connection =>
		Promise.all(names.map(name => saveLoadedQuestion(name, connection)))
	)

const saveLoadedQuestion = async (
	name: string,
	connection: DatabasePoolConnection
) => {
	const { question, answer, relatedQuestions, saveResult } =
		await loadQuestionByName(name, connection)

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
