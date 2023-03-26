import 'server-only'

import { connect } from '@/lib/pool'
import loadQuestionByName from './loadByName'

const saveLoadedQuestions = async (names: string[]) =>
	await connect(connection =>
		Promise.all(
			names.map(async name => {
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
			})
		)
	)

export default saveLoadedQuestions
