import 'server-only'

import createCompletion from '@/lib/openai/createCompletion'
import HttpError from '../error/http'
import ErrorCode from '../error/code'
import OpenAIError from '../openai/error'

const RELATED_QUESTIONS_COUNT = 3
const LINE_MATCH = /^\d+\.\s*(.+)$/

const getRelatedQuestions = async (question: string) => {
	try {
		const response = await createCompletion([
			{
				role: 'system',
				content: `Find ${RELATED_QUESTIONS_COUNT} related queries. Answer as a numbered list. Do not mention that you are an AI.`
			},
			{
				role: 'user',
				content: question
			}
		])

		const relatedQuestions = response
			.split('\n')
			.map(line => line.trim().match(LINE_MATCH)?.[1])
			.filter(Boolean) as string[]

		return relatedQuestions
	} catch (unknownError) {
		throw new HttpError(
			ErrorCode.Internal,
			(unknownError as OpenAIError).response.data.error.message
		)
	}
}

export default getRelatedQuestions
