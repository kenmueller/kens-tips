if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { Suspense } from 'react'
import { BlogPosting } from 'schema-dts'

import StructuredData from '@/components/StructuredData'
import Question from '@/lib/question'
import preview from '@/assets/preview.jpg'

const QuestionStructuredData = ({
	question,
	answer
}: {
	question: Question
	answer: Promise<string>
}) => (
	<Suspense>
		{/* @ts-expect-error Async Server Component */}
		<QuestionStructuredDataResolved question={question} answer={answer} />
	</Suspense>
)

const QuestionStructuredDataResolved = async ({
	question,
	answer: answerPromise
}: {
	question: Question
	answer: Promise<string>
}) => {
	const answer = await answerPromise

	const url = `${process.env.NEXT_PUBLIC_ORIGIN!}/q/${encodeURIComponent(
		question.question
	)}`
	const title = `${question.question} | Ken's Tips`
	const description = answer

	return (
		<StructuredData<BlogPosting>
			data={{
				'@context': 'https://schema.org',
				'@type': 'BlogPosting',
				name: title,
				description,
				image: preview.src,
				author: 'Ken Mueller',
				articleBody: answer,
				wordCount: answer.split(/\s+/).length,
				about: question.question,
				dateCreated: new Date(question.created).toISOString(),
				datePublished: new Date(question.created).toISOString(),
				discussionUrl: url,
				inLanguage: 'English'
			}}
		/>
	)
}

export default QuestionStructuredData
