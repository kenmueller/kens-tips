import { Suspense } from 'react'

import Markdown from '@/components/Markdown'

const Answer = ({
	className,
	answerHtml
}: {
	className?: string
	answerHtml: Promise<string>
}) => (
	<main className={className}>
		<Suspense fallback={<p>Loading...</p>}>
			{/* @ts-ignore */}
			<AnswerResolved answerHtml={answerHtml} />
		</Suspense>
	</main>
)

const AnswerResolved = async ({
	answerHtml: answerHtmlPromise
}: {
	answerHtml: Promise<string>
}) => {
	const answerHtml = await answerHtmlPromise

	return <Markdown html={answerHtml} />
}

export default Answer
