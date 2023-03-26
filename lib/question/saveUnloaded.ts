import 'server-only'

import { connect } from '@/lib/pool'
import QuestionStore from './store'
import getQuestionByName from './getByName'
import getDefaultQuestion from './default'
import createQuestion from './create'

const saveUnloadedQuestions = async (names: string[]) =>
	await connect(connection =>
		Promise.all(
			names.map(async name => {
				const questionInStore = QuestionStore.shared.getQuestionByName(name)

				const questionInDatabase = questionInStore
					? null
					: await getQuestionByName(name, connection)

				const question =
					questionInStore ?? questionInDatabase ?? getDefaultQuestion(name)

				const loading = !questionInDatabase
				const addToStore = loading && !questionInStore

				// Is the first client to load this question.
				if (addToStore) {
					QuestionStore.shared.addQuestion(question)

					createQuestion(question, { answer: null, related: null }, connection)

					QuestionStore.shared.removeQuestion(question.id)
				}

				return question
			})
		)
	)

export default saveUnloadedQuestions
