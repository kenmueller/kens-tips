import { Suspense } from 'react'

import Markdown from '@/components/Markdown'

const Answer = ({ answer }: { answer: Promise<string> }) => (
	<section>
		<Suspense fallback={<p>Loading...</p>}>
			{/* @ts-ignore */}
			<AnswerResolved answer={answer} />
		</Suspense>
	</section>
)

const AnswerResolved = async ({
	answer: answerPromise
}: {
	answer: Promise<string>
}) => {
	const answer = await answerPromise

	return <Markdown text={answer} />
}

export default Answer
