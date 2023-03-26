import 'server-only'

import { nanoid } from 'nanoid'

import Question from '.'

const getDefaultQuestion = (question: string): Question => ({
	id: nanoid(),
	question,
	answer: null,
	related: null,
	views: 0,
	created: Date.now()
})

export default getDefaultQuestion
