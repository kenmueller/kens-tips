import 'server-only'

import { ChatCompletionRequestMessage } from 'openai'

import openai from '.'
import { DEFAULT_MODEL } from './model'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'

const createCompletion = async (
	messages: ChatCompletionRequestMessage[],
	model = DEFAULT_MODEL
) => {
	const response = await openai.createChatCompletion({
		model,
		messages,
		temperature: 0.3
	})

	const text = response.data.choices[0]?.message?.content
	if (!text) throw new HttpError(ErrorCode.Internal, 'No text returned')

	return text
}

export default createCompletion
