import 'server-only'

import { ChatCompletionRequestMessage } from 'openai'

import openai from '.'
import HttpError from '../error/http'
import ErrorCode from '../error/code'

const createCompletion = async (messages: ChatCompletionRequestMessage[]) => {
	const response = await openai.createChatCompletion({
		model: 'gpt-4',
		messages,
		temperature: 0.3
	})

	const text = response.data.choices[0]?.message?.content
	if (!text) throw new HttpError(ErrorCode.Internal, 'No text returned')

	return text
}

export default createCompletion
