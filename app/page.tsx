import styles from './page.module.scss'

export const metadata = {
	title: 'Ken's Tips',
	description: 'Ken's Tips'
}

const Home = () => (
	<main className={styles.root}>
		<h1 className={styles.title}>Ken's Tips</h1>
	</main>
)

export default Home
