import { Suspense } from 'react'

const Answer = ({ answer }: { answer: Promise<string> }) => (
	<section>
		<Suspense fallback={<p>Loading...</p>}>
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

	return <p>{answer}</p>
}

export default Answer
