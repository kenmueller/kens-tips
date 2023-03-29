import 'server-only'

import createCompletion from '@/lib/openai/createCompletion'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import OpenAIError from '@/lib/openai/error'
import Model from '@/lib/openai/model'

const RELATED_QUESTIONS_COUNT = 6
const LINE_MATCH = /^\d+\.\s*(.+)$/

const getRelatedQuestions = async (question: string, model?: Model) => {
	try {
		const response = await createCompletion(
			[
				{
					role: 'system',
					content: `Find ${RELATED_QUESTIONS_COUNT} follow up questions. Answer as a numbered list. Do not mention that you are an AI.`
				},
				{
					role: 'user',
					content: question
				}
			],
			model
		)

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
