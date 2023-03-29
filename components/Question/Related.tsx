import { Suspense } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { RelatedQuestionWithInfo } from '@/lib/question/getRelatedWithInfo'
import PreloadRelatedQuestions from './PreloadRelated'

import styles from './Related.module.scss'

const RelatedQuestions = ({
	className,
	related
}: {
	className?: string
	related: Promise<RelatedQuestionWithInfo[]>
}) => (
	<section className={className}>
		<h2 className={styles.title}>Related Questions</h2>
		<Suspense fallback={<p>Loading...</p>}>
			{/* @ts-ignore */}
			<RelatedQuestionsResolved related={related} />
		</Suspense>
	</section>
)

const RelatedQuestionsResolved = async ({
	related: relatedPromise
}: {
	related: Promise<RelatedQuestionWithInfo[]>
}) => {
	const related = await relatedPromise

	return (
		<>
			<PreloadRelatedQuestions related={related.map(({ name }) => name)} />
			{related.map(({ name, info }, index) => (
				<Link
					key={index}
					className={styles.link}
					rel={(info?.views ?? 0) > 0 ? undefined : 'nofollow'} // Follow links to questions with views
					href={`/q/${encodeURIComponent(name)}`}
				>
					{name}
					<FontAwesomeIcon className={styles.linkIcon} icon={faChevronRight} />
				</Link>
			))}
		</>
	)
}

export default RelatedQuestions
