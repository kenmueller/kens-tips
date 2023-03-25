'use client'

if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')
if (!process.env.NEXT_PUBLIC_DISQUS_SHORTNAME)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_SHORTNAME')

import { DiscussionEmbed as _Comments } from 'disqus-react'

import styles from './Comments.module.scss'

const Comments = ({
	path,
	id,
	title
}: {
	path: string
	id: string
	title: string
}) => (
	<div className={styles.root}>
		<_Comments
			shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!}
			config={{
				url: `${process.env.NEXT_PUBLIC_ORIGIN!}${path}`,
				identifier: id,
				title
			}}
		/>
	</div>
)

export default Comments
