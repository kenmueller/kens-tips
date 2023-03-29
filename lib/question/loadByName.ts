import 'server-only'

import { DatabasePoolConnection } from 'slonik'

import getAnswer from '@/lib/question/getAnswer'
import getRelatedQuestions from '@/lib/question/getRelated'
import updateQuestion from '@/lib/question/update'
import createQuestion from '@/lib/question/create'
import QuestionStore from '@/lib/question/store'

const loadQuestionByName = async (
	name: string,
	connection?: DatabasePoolConnection
) => {
	const questionInStore = await QuestionStore.shared.getQuestionByName(name)

	const { question, questionInDatabase } = questionInStore
		? { question: questionInStore, questionInDatabase: false }
		: await QuestionStore.shared.addQuestion(name, connection)

	const originalAnswer = question.answer
	const originalRelated = question.related

	const answer = question.answer
		? Promise.resolve(question.answer) // Has answer already loaded
		: questionInStore // If another client is already loading the answer
		? QuestionStore.shared.getAnswer(question.id) // Subscribe to the other client loading the answer
		: // First client to load the answer
		  getAnswer(question.question).then(answer => {
				QuestionStore.shared.addAnswer(question.id, answer)
				return answer
		  })

	const relatedQuestions = question.related
		? Promise.resolve(question.related) // Has related questions already loaded
		: questionInStore // If another client is already loading the related questions
		? QuestionStore.shared.getRelatedQuestions(question.id) // Subscribe to the other client loading the related questions
		: // First client to load the related questions
		  getRelatedQuestions(question.question).then(related => {
				QuestionStore.shared.addRelatedQuestions(question.id, related)
				return related
		  })

	const saveResult = questionInStore
		? Promise.resolve()
		: Promise.all([answer, relatedQuestions])
				.then(([answer, relatedQuestions]) =>
					questionInDatabase
						? updateQuestion(
								question.question,
								{
									answer: originalAnswer ? null : answer,
									related: originalRelated ? null : relatedQuestions
								},
								connection
						  )
						: createQuestion(
								question,
								{ answer, related: relatedQuestions },
								connection
						  )
				)
				.then(() => {
					QuestionStore.shared.removeQuestion(question.id)
				})

	return { question, answer, relatedQuestions, saveResult }
}

export default loadQuestionByName
