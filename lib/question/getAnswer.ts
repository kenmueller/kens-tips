import 'server-only'

import createCompletion from '@/lib/openai/createCompletion'

const getAnswer = async (question: string) => {
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
}

export default getAnswer
