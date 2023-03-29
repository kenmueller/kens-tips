import 'server-only'

import getAnswer from './getAnswer'
import updateQuestion from './update'

const updateQuestionAnswer = async (name: string, prompt: string) => {
	const answer = await getAnswer(prompt)
	await updateQuestion(name, { answer, related: null })

	return answer
}

export default updateQuestionAnswer
