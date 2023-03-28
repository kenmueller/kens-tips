'use client'

if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')
if (!process.env.NEXT_PUBLIC_DISQUS_SHORTNAME)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_SHORTNAME')

import { CommentCount as _CommentCount } from 'disqus-react'

import CommentConfig from '@/lib/comment/config'

const CommentCount = ({ config }: { config: CommentConfig }) => (
	<_CommentCount
		shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!}
		config={{
			url: `${process.env.NEXT_PUBLIC_ORIGIN!}${config.path}`,
			identifier: config.id,
			title: config.title
		}}
	/>
)

export default CommentCount
