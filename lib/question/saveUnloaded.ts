import 'server-only'

if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { sql } from 'slonik'
import { nanoid } from 'nanoid'

import { connect } from '@/lib/pool'

const saveUnloadedQuestions = async (questions: string[]) => {
	const results = questions.map(question => ({
		url: `${process.env.NEXT_PUBLIC_ORIGIN}/q/${encodeURIComponent(question)}`,
		id: nanoid(),
		question
	}))

	await connect(async connection => {
		await connection.query(
			sql.unsafe`INSERT INTO
					   questions (id, question)
					   VALUES ${sql.join(
								results.map(
									({ id, question }) =>
										sql.unsafe`(${sql.join([id, question], sql.fragment`, `)})`
								),
								sql.fragment`, `
							)}`
		)
	})

	return results
}

export default saveUnloadedQuestions
