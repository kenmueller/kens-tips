import { Suspense } from 'react'
import Link from 'next/link'

import styles from './Related.module.scss'

const RelatedQuestions = ({
	className,
	related
}: {
	className?: string
	related: Promise<string[]>
}) => (
	<section className={className}>
		<h3>Related Questions</h3>
		<Suspense fallback={<p>Loading...</p>}>
			{/* @ts-ignore */}
			<RelatedQuestionsResolved related={related} />
		</Suspense>
	</section>
)

const RelatedQuestionsResolved = async ({
	related: relatedPromise
}: {
	related: Promise<string[]>
}) => {
	const related = await relatedPromise

	return related.map((question, index) => (
		<Link
			key={index}
			className={styles.link}
			href={`/q/${encodeURIComponent(question)}`}
		>
			{question}
		</Link>
	))
}

export default RelatedQuestions
