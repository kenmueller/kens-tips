import 'server-only'

import createCompletion from '@/lib/openai/createCompletion'
import OpenAIError from '../openai/error'
import HttpError from '../error/http'
import ErrorCode from '../error/code'

const getAnswer = async (question: string) => {
	try {
		const answer = await createCompletion([
			{
				role: 'system',
				content:
					'Answer this question as a blog post. Do not mention that you are an AI.'
			},
			{
				role: 'user',
				content: question
			}
		])

		return answer
	} catch (unknownError) {
		throw new HttpError(
			ErrorCode.Internal,
			(unknownError as OpenAIError).response.data.error.message
		)
	}
}

export default getAnswer
