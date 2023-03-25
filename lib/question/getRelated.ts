import 'server-only'

import createCompletion from '@/lib/openai/createCompletion'

const RELATED_QUESTIONS_COUNT = 3

const getRelatedQuestions = async (question: string) => {
	const response = await createCompletion([
		{
			role: 'system',
			content: `Find ${RELATED_QUESTIONS_COUNT} related queries. Do not mention that you are an AI.`
		},
		{
			role: 'user',
			content: question
		}
	])

	const relatedQuestions = response.split('\n').filter(Boolean)

	return relatedQuestions
}

export default getRelatedQuestions
