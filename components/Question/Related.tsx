import { Suspense } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import PreloadRelatedQuestions from './PreloadRelated'

import styles from './Related.module.scss'

const RelatedQuestions = ({
	className,
	related
}: {
	className?: string
	related: Promise<string[]>
}) => (
	<section className={className}>
		<h3 className={styles.title}>Related Questions</h3>
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

	return (
		<>
			<PreloadRelatedQuestions related={related} />
			{related.map((question, index) => (
				<Link
					key={index}
					className={styles.link}
					href={`/q/${encodeURIComponent(question)}`}
				>
					{question}
					<FontAwesomeIcon className={styles.linkIcon} icon={faChevronRight} />
				</Link>
			))}
		</>
	)
}

export default RelatedQuestions
