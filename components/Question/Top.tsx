import { Suspense } from 'react'
import Link from 'next/link'

import Question from '@/lib/question'

import styles from './Top.module.scss'

const TopQuestions = ({ questions }: { questions: Promise<Question[]> }) => (
	<section>
		<h2>Top Questions</h2>
		<Suspense fallback={<p>Loading...</p>}>
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
			<span>
				{question.views} view{question.views === 1 ? '' : 's'}
			</span>
		</Link>
	))
}

export default TopQuestions
