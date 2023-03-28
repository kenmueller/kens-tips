import { Suspense } from 'react'
import Link from 'next/link'

import Question from '@/lib/question'

import styles from './Top.module.scss'

const TopQuestions = ({
	className,
	questions
}: {
	className?: string
	questions: Promise<Question[]>
}) => (
	<section className={className}>
		<h2 className={styles.title}>Top Questions</h2>
		<Suspense fallback={<p className={styles.loading}>Loading...</p>}>
			{/* @ts-ignore */}
			<TopQuestionsResolved questions={questions} />
		</Suspense>
	</section>
)

const TopQuestionsResolved = async ({
	questions: questionsPromise
}: {
	questions: Promise<Question[]>
}) => {
	const questions = await questionsPromise

	return questions.map(question => (
		<Link
			key={question.id}
			className={styles.question}
			href={`/q/${encodeURIComponent(question.question)}`}
		>
			<span>{question.question}</span>
			<span className={styles.questionViews}>
				{question.views} view{question.views === 1 ? '' : 's'}
			</span>
		</Link>
	))
}

export default TopQuestions
