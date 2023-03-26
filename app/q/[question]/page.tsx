import { Suspense } from 'react'

import CommentCount from '@/components/Disqus/CommentCount'
import Comments from '@/components/Disqus/Comments'
import loadQuestionByName from '@/lib/question/loadByName'
import RelatedQuestions from '@/components/Question/Related'
import Answer from '@/components/Question/Answer'
import formatDate from '@/lib/format/date'
import CommentConfig from '@/lib/comment/config'
import Resolve from '@/components/Resolve'
import Search from '@/components/Search'
import { connect } from '@/lib/pool'

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

	const { question, answer, relatedQuestions, saveResult } =
		await loadQuestionByName(normalizedName)

	const commentConfig: CommentConfig = {
		path: `/q/${encodeURIComponent(question.question)}`,
		id: question.id,
		title: question.question
	}

	return (
		<main className={styles.root}>
			<nav>
				<Search />
			</nav>
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
