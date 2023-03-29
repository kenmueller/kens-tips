import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'
import { connect } from '@/lib/pool'

const updateQuestion = async (
	name: string,
	{ answer, related }: { answer: string | null; related: string[] | null },
	connection?: DatabasePoolConnection
) => {
	if (!(answer || related)) return

	await (connection
		? updateQuestionWithConnection(name, { answer, related }, connection)
		: connect(connection =>
				updateQuestionWithConnection(name, { answer, related }, connection)
		  ))
}

const updateQuestionWithConnection = async (
	name: string,
	{ answer, related }: { answer: string | null; related: string[] | null },
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`UPDATE questions
				   SET ${sql.join(
							[
								answer && sql.unsafe`answer = ${answer}`,
								related && sql.unsafe`related = ${sql.array(related, 'text')}`
							].filter(Boolean) as string[],
							sql.fragment`, `
						)}
				   WHERE question ILIKE ${name}`
	)
}

export default updateQuestion
