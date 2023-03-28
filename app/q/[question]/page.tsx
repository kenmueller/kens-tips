if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { Suspense, cache } from 'react'
import { Metadata } from 'next'

import CommentCount from '@/components/Disqus/CommentCount'
import Comments from '@/components/Disqus/Comments'
import loadQuestionByName from '@/lib/question/loadByName'
import RelatedQuestions from '@/components/Question/Related'
import Answer from '@/components/Question/Answer'
import formatDate from '@/lib/format/date'
import CommentConfig from '@/lib/comment/config'
import Resolve from '@/components/Resolve'
import Search from '@/components/Search'
import QuestionStructuredData from '@/components/Question/StructuredData'
import isBot from '@/lib/isBot'
import preview from '@/assets/preview.jpg'

import styles from './page.module.scss'
import Views from '@/components/Question/Views'

const isBotCached = cache(isBot)
const loadQuestionByNameCached = cache(loadQuestionByName)

const image = {
	url: preview.src,
	width: preview.width,
	height: preview.height,
	alt: "Ken's Tips"
}

export const generateMetadata = async ({
	params: { question: name }
}: {
	params: { question: string }
}): Promise<Metadata> => {
	const bot = isBotCached()

	const normalizedName = decodeURIComponent(name).trim()

	const url = `${process.env.NEXT_PUBLIC_ORIGIN!}/q/${encodeURIComponent(
		normalizedName
	)}`
	const title = `${normalizedName} | Ken's Tips`

	if (bot) {
		const { question, answer, relatedQuestions, saveResult } =
			await loadQuestionByNameCached(normalizedName)

		const [answerUnwrapped] = await Promise.all([
			answer,
			relatedQuestions,
			saveResult
		])

		const description = answerUnwrapped

		return {
			alternates: { canonical: url },
			title,
			description,
			openGraph: {
				type: 'article',
				title,
				description,
				siteName: "Ken's Tips",
				locale: 'en_US',
				url,
				images: image,
				countryName: 'United States',
				publishedTime: new Date(question.created).toISOString(),
				authors: 'Ken Mueller'
			},
			twitter: {
				card: 'summary',
				site: '@kens_tips',
				creator: '@kens_tips',
				title,
				description,
				images: image
			}
		}
	} else {
		return {
			alternates: { canonical: url },
			title: `${normalizedName} | Ken's Tips`
		}
	}
}

const QuestionPage = async ({
	params: { question: name }
}: {
	params: { question: string }
}) => {
	const bot = isBotCached()

	const normalizedName = decodeURIComponent(name).trim()

	const { question, answer, relatedQuestions, saveResult } =
		await loadQuestionByNameCached(normalizedName)

	const commentConfig: CommentConfig = {
		path: `/q/${encodeURIComponent(question.question)}`,
		id: question.id,
		title: question.question
	}

	return (
		<main className={styles.root}>
			<nav>
				<Search />
			</nav>
			<h1>{question.question}</h1>
			<Views question={question} bot={bot} />
			<p>Written on {formatDate(new Date(question.created))}</p>
			<CommentCount config={commentConfig} />
			<Answer className={styles.section} answer={answer} />
			<RelatedQuestions className={styles.section} related={relatedQuestions} />
			<Comments className={styles.section} config={commentConfig} />
			<QuestionStructuredData question={question} answer={answer} />
			<Suspense>
				{/* @ts-ignore */}
				<Resolve promise={saveResult} />
			</Suspense>
		</main>
	)
}

export default QuestionPage
