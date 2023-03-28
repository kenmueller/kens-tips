import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'

import Question from '.'
import { connect } from '@/lib/pool'

const getTopQuestions = (count: number, connection?: DatabasePoolConnection) =>
	connection
		? getTopQuestionsWithConnection(count, connection)
		: connect(connection => getTopQuestionsWithConnection(count, connection))

const getTopQuestionsWithConnection = async (
	count: number,
	connection: DatabasePoolConnection
) => {
	const questions = (await connection.any(
		sql.unsafe`SELECT *
				   FROM questions
				   ORDER BY views DESC
				   LIMIT ${count}`
	)) as Question[]

	return questions
}

export default getTopQuestions
