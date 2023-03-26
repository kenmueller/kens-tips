import mdToHtml from '@/lib/mdToHtml'

import styles from './Markdown.module.scss'

const Markdown = ({ text }: { text: string }) => (
	<div
		className={styles.root}
		dangerouslySetInnerHTML={{ __html: mdToHtml(text) }}
	/>
)

export default Markdown
