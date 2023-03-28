if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { cache } from 'react'
import { Blog } from 'schema-dts'

import Search from '@/components/Search'
import StructuredData from '@/components/StructuredData'
import PageView from '@/components/PageView'
import isBot from '@/lib/isBot'
import preview from '@/assets/preview.jpg'

import styles from './page.module.scss'

const isBotCached = cache(isBot)

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

const HomePage = () => {
	const bot = isBotCached()

	return (
		<main className={styles.root}>
			<h1 className={styles.title}>Ken's Tips</h1>
			<Search />
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
		</main>
	)
}

export default HomePage
