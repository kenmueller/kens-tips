import 'server-only'

import createCompletion from '@/lib/openai/createCompletion'
import OpenAIError from '@/lib/openai/error'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import Model from '@/lib/openai/model'

const WORD_COUNT = 1000

const getAnswer = async (question: string, model?: Model) => {
	try {
		const answer = await createCompletion(
			[
				{
					role: 'system',
					content: `Answer this question as a blog post. Write at least ${WORD_COUNT} words.`
				},
				{
					role: 'user',
					content: question
				}
			],
			model
		)

		return answer
	} catch (unknownError) {
		throw new HttpError(
			ErrorCode.Internal,
			(unknownError as OpenAIError).response.data.error.message
		)
	}
}

export default getAnswer
