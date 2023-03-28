import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'

import { connect } from '@/lib/pool'

const updateQuestionViews = (id: string, connection?: DatabasePoolConnection) =>
	connection
		? updateQuestionViewsWithConnection(id, connection)
		: connect(connection => updateQuestionViewsWithConnection(id, connection))

const updateQuestionViewsWithConnection = async (
	id: string,
	connection: DatabasePoolConnection
) => {
	await connection.query(
		sql.unsafe`UPDATE questions
				   SET views = views + 1
				   WHERE id = ${id}`
	)
}

export default updateQuestionViews
