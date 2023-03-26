import { Suspense } from 'react'

import CommentCount from '@/components/Disqus/CommentCount'
import Comments from '@/components/Disqus/Comments'
import getQuestionByName from '@/lib/question/getByName'
import Question from '@/lib/question'
import getDefaultQuestion from '@/lib/question/default'
import getAnswer from '@/lib/question/getAnswer'
import getRelatedQuestions from '@/lib/question/getRelated'
import RelatedQuestions from '@/components/Question/Related'
import Answer from '@/components/Question/Answer'
import formatDate from '@/lib/format/date'
import CommentConfig from '@/lib/comment/config'
import Resolve from '@/components/Resolve'
import updateQuestion from '@/lib/question/update'
import createQuestion from '@/lib/question/create'

import styles from './page.module.scss'
import QuestionStore from '@/lib/question/store'

export const metadata = {
	title: "Ken's Tips",
	description: "Ken's Tips"
}

const QuestionPage = async ({
	params: { question: name }
}: {
	params: { question: string }
}) => {
	const normalizedName = decodeURIComponent(name).trim()

	const questionInStore = QuestionStore.shared.getQuestionByName(normalizedName)

	const questionInDatabase = questionInStore
		? null
		: await getQuestionByName(normalizedName)

	const question =
		questionInStore ?? questionInDatabase ?? getDefaultQuestion(normalizedName)

	const loading = !(question.answer && question.related)
	const addToStore = loading && !questionInStore

	// Has missing fields and is the first client to load this question.
	if (addToStore) QuestionStore.shared.addQuestion(question)

	const answer = question.answer
		? Promise.resolve(question.answer) // Has answer already loaded
		: questionInStore // If another client is already loading the answer
		? QuestionStore.shared.getAnswer(question.id) // Subscribe to the other client loading the answer
		: // First client to load the answer
		  getAnswer(question.question).then(answer => {
				QuestionStore.shared.addAnswer(question.id, answer)
				return answer
		  })

	const relatedQuestions = question.related
		? Promise.resolve(question.related) // Has related questions already loaded
		: questionInStore // If another client is already loading the related questions
		? QuestionStore.shared.getRelatedQuestions(question.id) // Subscribe to the other client loading the related questions
		: // First client to load the related questions
		  getRelatedQuestions(question.question).then(related => {
				QuestionStore.shared.addRelatedQuestions(question.id, related)
				return related
		  })

	const saveResult = addToStore // Has missing fields and is the first client to load this question.
		? Promise.all([answer, relatedQuestions])
				.then(([answer, relatedQuestions]) =>
					questionInDatabase
						? updateQuestion(question.id, {
								answer: question.answer ? null : answer,
								related: question.related ? null : relatedQuestions
						  })
						: createQuestion(question, { answer, related: relatedQuestions })
				)
				.then(() => {
					QuestionStore.shared.removeQuestion(question.id)
				})
		: Promise.resolve()

	const commentConfig: CommentConfig = {
		path: `/q/${encodeURIComponent(question.question)}`,
		id: question.id,
		title: question.question
	}

	return (
		<main className={styles.root}>
			<h1>{question.question}</h1>
			<p>Views: {question.views}</p>
			<p>Written on {formatDate(new Date(question.created))}</p>
			<CommentCount config={commentConfig} />
			<Answer className={styles.section} answer={answer} />
			<RelatedQuestions className={styles.section} related={relatedQuestions} />
			<Comments className={styles.section} config={commentConfig} />
			<Suspense>
				{/* @ts-ignore */}
				<Resolve promise={saveResult} />
			</Suspense>
		</main>
	)
}

export default QuestionPage
