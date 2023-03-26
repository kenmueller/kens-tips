import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'

import Question from '.'
import { connect } from '@/lib/pool'

const createQuestion = async (
	question: Question,
	{ answer, related }: { answer: string | null; related: string[] | null },
	connection?: DatabasePoolConnection
) =>
	connection
		? createQuestionWithConnection(question, { answer, related }, connection)
		: connect(connection =>
				createQuestionWithConnection(question, { answer, related }, connection)
		  )

const createQuestionWithConnection = async (
	question: Question,
	{ answer, related }: { answer: string | null; related: string[] | null },
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`INSERT INTO
				   questions (id, question, answer, related)
				   VALUES (${sql.join(
							[
								question.id,
								question.question,
								answer,
								related && sql.array(related, 'text')
							],
							sql.fragment`, `
						)})`
	)
}

export default createQuestion
