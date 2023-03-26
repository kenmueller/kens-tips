import 'server-only'

import { sql } from 'slonik'

import { connect } from '@/lib/pool'
import Question from '.'

const createQuestion = async (
	question: Question,
	{ answer, related }: { answer: string; related: string[] }
) => {
	await connect(async connection => {
		await connection.query(
			sql.unsafe`INSERT INTO
				       questions (id, question, answer, related)
				       VALUES (${sql.join(
									[
										question.id,
										question.question,
										answer,
										sql.array(related, 'text')
									],
									sql.fragment`, `
								)})`
		)
	})
}

export default createQuestion
