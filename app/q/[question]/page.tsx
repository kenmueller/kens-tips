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

	const _question = await getQuestionByName(normalizedName)

	const hasQuestion = Boolean(_question)
	const question: Question = _question ?? getDefaultQuestion(normalizedName)

	const hasAnswer = Boolean(question.answer)
	const answer = question.answer
		? Promise.resolve(question.answer)
		: getAnswer(question.question)

	const hasRelatedQuestions = Boolean(question.related)
	const relatedQuestions = question.related
		? Promise.resolve(question.related)
		: getRelatedQuestions(question.question)

	const saveResult = Promise.all([answer, relatedQuestions]).then(
		([answer, relatedQuestions]) =>
			hasQuestion
				? updateQuestion(question.id, {
						answer: hasAnswer ? null : answer,
						related: hasRelatedQuestions ? null : relatedQuestions
				  })
				: createQuestion(question, { answer, related: relatedQuestions })
	)

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
			<Answer answer={answer} />
			<RelatedQuestions related={relatedQuestions} />
			<Comments config={commentConfig} />
			<Suspense>
				{/* @ts-ignore */}
				<Resolve promise={saveResult} />
			</Suspense>
		</main>
	)
}

export default QuestionPage
