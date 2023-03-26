'use client'

if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')
if (!process.env.NEXT_PUBLIC_DISQUS_SHORTNAME)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_SHORTNAME')

import { DiscussionEmbed as _Comments } from 'disqus-react'
import cx from 'classnames'

import useIsClient from '@/lib/useIsClient'
import CommentConfig from '@/lib/comment/config'

import styles from './Comments.module.scss'

const Comments = ({
	className,
	config
}: {
	className?: string
	config: CommentConfig
}) => {
	const isClient = useIsClient()

	return isClient ? (
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
	) : null
}

export default Comments
