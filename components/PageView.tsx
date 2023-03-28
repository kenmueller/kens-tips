'use client'

import { useEffect } from 'react'

import logEventLazy from '@/lib/logEvent/lazy'

const PageView = ({
	params
}: {
	params: {
		page_path: string
		page_title: string
		bot: boolean
		[key: string]: unknown
	}
}) => {
	useEffect(() => {
		logEventLazy('page_view', params).catch(console.error)
	}, [params])

	return null
}

export default PageView
