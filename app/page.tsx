if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import Search from '@/components/Search'
import preview from '@/assets/preview.jpg'

import styles from './page.module.scss'

const url = process.env.NEXT_PUBLIC_ORIGIN
const title = "Ken's Tips"
const description = 'A series of questions and answers by Ken Mueller'
const image = {
	url: preview.src,
	width: preview.width,
	height: preview.height,
	alt: "Ken's Tips"
}

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

const HomePage = () => (
	<main className={styles.root}>
		<h1 className={styles.title}>Ken's Tips</h1>
		<Search />
	</main>
)

export default HomePage
