if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { Suspense, cache } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

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
import Views from '@/components/Question/Views'
import PageView from '@/components/PageView'
import preview from '@/assets/preview.jpg'

import styles from './page.module.scss'

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

	if (bot) {
		const { question, answer, relatedQuestions, saveResult } =
			await loadQuestionByNameCached(normalizedName)

		const [answerUnwrapped] = await Promise.all([
			answer,
			relatedQuestions,
			saveResult
		])

		const url = `${process.env.NEXT_PUBLIC_ORIGIN!}/q/${encodeURIComponent(
			question.question
		)}`
		const title = `${question.question} | Ken's Tips`
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
		return { title: `${normalizedName} | Ken's Tips` }
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
			<nav className={styles.nav}>
				<Link className={styles.title} href="/">
					Ken's Tips
				</Link>
				<Search />
			</nav>
			<h1 className={styles.question}>{question.question}</h1>
			<section className={styles.info}>
				<p>Written on {formatDate(new Date(question.created))}</p>
				<Views question={question} bot={bot} />
				<CommentCount config={commentConfig} />
			</section>
			<Answer className={styles.answer} answer={answer} />
			<RelatedQuestions className={styles.related} related={relatedQuestions} />
			<Comments className={styles.comments} config={commentConfig} />
			<div className={styles.bottomSpacer} />
			<QuestionStructuredData question={question} answer={answer} />
			<Suspense>
				{/* @ts-ignore */}
				<Resolve promise={saveResult} />
			</Suspense>
			<PageView
				params={{
					page_path: `/q/${encodeURIComponent(question.question)}`,
					page_title: `${question.question} | Ken's Tips`,
					bot
				}}
			/>
		</main>
	)
}

export default QuestionPage
