import 'server-only'

import { DatabasePoolConnection } from 'slonik'

import getQuestionByName from './getByName'
import { connect } from '@/lib/pool'
import Question from '.'

export interface RelatedQuestionWithInfo {
	name: string
	info: Question | null
}

const getRelatedQuestionsWithInfo = (
	relatedQuestions: string[],
	connection?: DatabasePoolConnection
) =>
	connection
		? getRelatedQuestionsWithInfoWithConnection(relatedQuestions, connection)
		: connect(connection =>
				getRelatedQuestionsWithInfoWithConnection(relatedQuestions, connection)
		  )

const getRelatedQuestionsWithInfoWithConnection = (
	relatedQuestions: string[],
	connection: DatabasePoolConnection
): Promise<RelatedQuestionWithInfo[]> =>
	Promise.all(
		relatedQuestions.map(async name => ({
			name,
			info: await getQuestionByName(name, connection)
		}))
	)

export default getRelatedQuestionsWithInfo
