import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'

const updateQuestionViews = (
	name: string,
	connection?: DatabasePoolConnection
) =>
	connection
		? updateQuestionViewsWithConnection(name, connection)
		: connect(connection => updateQuestionViewsWithConnection(name, connection))

const updateQuestionViewsWithConnection = async (
	name: string,
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`UPDATE questions
				   SET views = views + 1
				   WHERE question ILIKE ${name}`
	)
}

export default updateQuestionViews
