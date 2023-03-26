import { Suspense } from 'react'
import Link from 'next/link'

const RelatedQuestions = ({ related }: { related: Promise<string[]> }) => (
	<section>
		<h3>Related Questions</h3>
		<Suspense fallback={<p>Loading...</p>}>
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
		<Link key={index} href={`/q/${encodeURIComponent(question)}`}>
			{question}
		</Link>
	))
}

export default RelatedQuestions
