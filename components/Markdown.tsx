import cx from 'classnames'

import mdToHtml from '@/lib/mdToHtml'

import styles from './Markdown.module.scss'

const Markdown = ({
	className,
	...props
}: {
	className?: string
} & ({ text: string } | { html: string })) => (
	<div
		className={cx(styles.root, className)}
		dangerouslySetInnerHTML={{
			__html: 'html' in props ? props.html : mdToHtml(props.text)
		}}
	/>
)

export default Markdown
