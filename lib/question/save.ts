import 'server-only'

import { sql } from 'slonik'
import { nanoid } from 'nanoid'

import { connect } from '@/lib/pool'

const saveQuestions = async (questions: string[]) => {
	await connect(async connection => {
		await connection.query(
			sql.unsafe`INSERT INTO
					   questions (id, question)
					   VALUES ${sql.join(
								questions.map(
									question => sql.unsafe`(${nanoid()}, ${question})`
								),
								sql.fragment`, `
							)}`
		)
	})
}

export default saveQuestions
