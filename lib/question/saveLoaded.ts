import 'server-only'

if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { sql } from 'slonik'
import { nanoid } from 'nanoid'

import { connect } from '@/lib/pool'
import getAnswer from './getAnswer'
import getRelatedQuestions from './getRelated'

const saveLoadedQuestions = async (questions: string[]) => {
	const results = await Promise.all(
		questions.map(async question => {
			const [answer, related] = await Promise.all([
				getAnswer(question),
				getRelatedQuestions(question)
			])

			return {
				url: `${process.env.NEXT_PUBLIC_ORIGIN}/q/${encodeURIComponent(
					question
				)}`,
				id: nanoid(),
				question,
				answer,
				related
			}
		})
	)

	await connect(async connection => {
		await connection.query(
			sql.unsafe`INSERT INTO
				   questions (id, question, answer, related)
				   VALUES ${sql.join(
							results.map(
								({ id, question, answer, related }) =>
									sql.unsafe`(${sql.join(
										[id, question, answer, sql.array(related, 'text')],
										sql.fragment`, `
									)})`
							),
							sql.fragment`, `
						)}`
		)
	})

	return results
}

export default saveLoadedQuestions
