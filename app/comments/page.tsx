import styles from './page.module.scss'

export const metadata = {
	title: "Comment Policy | Ken's Tips",
	description: "Comment Policy | Ken's Tips"
}

const CommentPolicyPage = () => (
	<main className={styles.root}>
		<h1>Comment Policy</h1>
		<p className={styles.description}>
			We welcome relevant and respectful comments. Off-topic comments may be
			removed.
		</p>
	</main>
)

export default CommentPolicyPage
