import 'server-only'

import { DatabasePoolConnection } from 'slonik'

import getQuestionByName from '@/lib/question/getByName'
import getDefaultQuestion from '@/lib/question/default'
import getAnswer from '@/lib/question/getAnswer'
import getRelatedQuestions from '@/lib/question/getRelated'
import updateQuestion from '@/lib/question/update'
import createQuestion from '@/lib/question/create'
import QuestionStore from '@/lib/question/store'

const loadQuestionByName = async (
	name: string,
	connection?: DatabasePoolConnection
) => {
	const questionInStore = QuestionStore.shared.getQuestionByName(name)

	const questionInDatabase = questionInStore
		? null
		: await getQuestionByName(name, connection)

	const question =
		questionInStore ?? questionInDatabase ?? getDefaultQuestion(name)

	const loading = !(question.answer && question.related)
	const addToStore = loading && !questionInStore

	// Has missing fields and is the first client to load this question.
	if (addToStore) QuestionStore.shared.addQuestion(question)

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

	const saveResult = addToStore // Has missing fields and is the first client to load this question.
		? Promise.all([answer, relatedQuestions])
				.then(([answer, relatedQuestions]) =>
					questionInDatabase
						? updateQuestion(
								question.id,
								{
									answer: question.answer ? null : answer,
									related: question.related ? null : relatedQuestions
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
		: Promise.resolve()

	return { question, answer, relatedQuestions, saveResult }
}

export default loadQuestionByName
