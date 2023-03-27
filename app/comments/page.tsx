if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { Blog } from 'schema-dts'

import preview from '@/assets/preview.jpg'
import StructuredData from '@/components/StructuredData'

import styles from './page.module.scss'

const url = process.env.NEXT_PUBLIC_ORIGIN
const title = "Comment Policy | Ken's Tips"
const description = 'Our comment policy'
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

const CommentPolicyPage = () => (
	<main className={styles.root}>
		<h1>Comment Policy</h1>
		<p className={styles.description}>
			We welcome relevant and respectful comments. Off-topic comments may be
			removed.
		</p>
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
	</main>
)

export default CommentPolicyPage
