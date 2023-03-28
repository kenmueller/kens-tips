if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { cache } from 'react'
import { Blog } from 'schema-dts'

import Search from '@/components/Search'
import StructuredData from '@/components/StructuredData'
import PageView from '@/components/PageView'
import isBot from '@/lib/isBot'
import getTopQuestions from '@/lib/question/getTop'
import TopQuestions from '@/components/Question/Top'
import preview from '@/assets/preview.jpg'

import styles from './page.module.scss'

const TOP_QUESTIONS_COUNT = 100

const isBotCached = cache(isBot)
const getTopQuestionsCached = cache(getTopQuestions)

const url = process.env.NEXT_PUBLIC_ORIGIN
const title = "Ken's Tips"
const description = 'A series of questions and answers by Ken Mueller'
const image = {
	url: preview.src,
	width: preview.width,
	height: preview.height,
	alt: "Ken's Tips"
}

const structuredDataTitle = "Ken's Tips"
const structuredDataDescription =
	'A series of questions and answers by Ken Mueller'

export const revalidate = 3600

export const metadata = {
	alternates: { canonical: url },
	title,
	description,
	openGraph: {
		type: 'website',
		title,
		description,
		siteName: "Ken's Tips",
		locale: 'en_US',
		url,
		images: image,
		countryName: 'United States'
	},
	twitter: {
		card: 'summary_large_image',
		site: '@kens_tips',
		creator: '@kens_tips',
		title,
		description,
		images: image
	}
}

const HomePage = async () => {
	const bot = isBotCached()
	const topQuestions = getTopQuestionsCached(TOP_QUESTIONS_COUNT)

	return (
		<div className={styles.root}>
			<main>
				<h1 className={styles.title}>Ken's Tips</h1>
				<p className={styles.subtitle}>{description}</p>
			</main>
			<section className={styles.searchContainer}>
				<Search className={styles.search} autoFocus />
			</section>
			<TopQuestions className={styles.topQuestions} questions={topQuestions} />
			<div className={styles.bottomSpacer} aria-hidden />
			<StructuredData<Blog>
				data={{
					'@context': 'https://schema.org',
					'@type': 'Blog',
					about: structuredDataDescription,
					description: structuredDataDescription,
					abstract: structuredDataDescription,
					author: 'Ken Mueller',
					name: structuredDataTitle,
					image: image.url,
					inLanguage: 'English'
				}}
			/>
			<PageView params={{ page_path: '/', page_title: title, bot }} />
		</div>
	)
}

export default HomePage
