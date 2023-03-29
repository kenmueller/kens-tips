import 'server-only'

import getAnswer from './getAnswer'
import updateQuestion from './update'
import Model from '@/lib/openai/model'

const updateQuestionAnswer = async (
	name: string,
	prompt: string,
	model?: Model
) => {
	const answer = await getAnswer(prompt, model)
	await updateQuestion(name, { answer, related: null })

	return answer
}

export default updateQuestionAnswer
