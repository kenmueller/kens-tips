import 'server-only'

import { sql, DatabasePoolConnection } from 'slonik'
import { parse } from 'postgres-array'

import Question from '.'
import { connect } from '@/lib/pool'

const getQuestionByName = async (
	name: string,
	connection?: DatabasePoolConnection
) =>
	connection
		? getQuestionByNameWithConnection(name, connection)
		: connect(connection => getQuestionByNameWithConnection(name, connection))

const getQuestionByNameWithConnection = async (
	name: string,
	connection: DatabasePoolConnection
) => {
	const questions = (await connection.any(
		sql.unsafe`SELECT *
				   FROM questions
				   WHERE question = ${name}`
	)) as Question[]

	const question = questions[0]
	if (!question) return null

	if (question.related)
		question.related = parse(question.related as unknown as string)

	return question
}

export default getQuestionByName
