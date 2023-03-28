import { Suspense } from 'react'

import Markdown from '@/components/Markdown'

const Answer = ({
	className,
	answer
}: {
	className?: string
	answer: Promise<string>
}) => (
	<main className={className}>
		<Suspense fallback={<p>Loading...</p>}>
			{/* @ts-ignore */}
			<AnswerResolved answer={answer} />
		</Suspense>
	</main>
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
