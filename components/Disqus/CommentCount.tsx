'use client'

if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')
if (!process.env.NEXT_PUBLIC_DISQUS_SHORTNAME)
	throw new Error('Missing NEXT_PUBLIC_DISQUS_SHORTNAME')

import { CommentCount as _CommentCount } from 'disqus-react'

const CommentCount = ({
	path,
	id,
	title
}: {
	path: string
	id: string
	title: string
}) => (
	<_CommentCount
		shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!}
		config={{
			url: `${process.env.NEXT_PUBLIC_ORIGIN!}${path}`,
			identifier: id,
			title
		}}
	/>
)

export default CommentCount
