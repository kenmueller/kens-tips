import Search from '@/components/Search'

import styles from './page.module.scss'

export const metadata = {
	title: "Ken's Tips",
	description: "Ken's Tips"
}

const HomePage = () => (
	<main className={styles.root}>
		<h1 className={styles.title}>Ken's Tips</h1>
		<Search />
	</main>
)

export default HomePage
