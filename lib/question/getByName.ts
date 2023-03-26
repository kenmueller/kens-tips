import 'server-only'

import { sql } from 'slonik'
import { parse } from 'postgres-array'

import { connect } from '@/lib/pool'
import Question from '.'

const getQuestionByName = async (name: string) => {
	const questions = await connect(
		async connection =>
			(await connection.any(
				sql.unsafe`SELECT *
					   	   FROM questions
					       WHERE question = ${name}`
			)) as Question[]
	)

	const question = questions[0]
	if (!question) return null

	if (question.related)
		question.related = parse(question.related as unknown as string)

	return question
}

export default getQuestionByName
