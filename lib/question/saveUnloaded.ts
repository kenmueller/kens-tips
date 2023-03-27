import 'server-only'

import { DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'
import QuestionStore from './store'
import createQuestion from './create'

const saveUnloadedQuestions = async (names: string[]) =>
	await connect(connection =>
		Promise.all(names.map(name => saveUnloadedQuestion(name, connection)))
	)

const saveUnloadedQuestion = async (
	name: string,
	connection: DatabasePoolConnection
) => {
	const questionInStore = await QuestionStore.shared.getQuestionByName(name)

	const { question, questionInDatabase } = questionInStore
		? { question: questionInStore, questionInDatabase: false }
		: await QuestionStore.shared.addQuestion(name, connection)

	if (!questionInStore) {
		if (!questionInDatabase)
			await createQuestion(
				question,
				{ answer: null, related: null },
				connection
			)

		QuestionStore.shared.removeQuestion(question.id)
	}

	return question
}

export default saveUnloadedQuestions
