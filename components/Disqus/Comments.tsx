'use client'

if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')
if (!process.env.NEXT_PUBLIC_DISQUS_SHORTNAME)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_SHORTNAME')

import dynamic from 'next/dynamic'
import cx from 'classnames'

import CommentConfig from '@/lib/comment/config'

import styles from './Comments.module.scss'

const _Comments = dynamic(
	() => import('disqus-react').then(module => module.DiscussionEmbed),
	{ ssr: false }
)

const Comments = ({
	className,
	config
}: {
	className?: string
	config: CommentConfig
}) => (
	<div className={cx(styles.root, className)}>
		<_Comments
			shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!}
			config={{
				url: `${process.env.NEXT_PUBLIC_ORIGIN!}${config.path}`,
				identifier: config.id,
				title: config.title
			}}
		/>
	</div>
)

export default Comments
