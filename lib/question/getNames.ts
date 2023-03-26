import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'

const getQuestionNames = (connection?: DatabasePoolConnection) =>
	connection
		? getQuestionNamesWithConnection(connection)
		: connect(connection => getQuestionNamesWithConnection(connection))

const getQuestionNamesWithConnection = async (
	connection: DatabasePoolConnection
) => {
	const questions = (await connection.any(
		sql.unsafe`SELECT question
		 		   FROM questions`
	)) as { question: string }[]

	return questions.map(({ question }) => question)
}

export default getQuestionNames
