'use client'

import { useCallback, useEffect } from 'react'

import errorFromResponse from '@/lib/error/fromResponse'

const PreloadRelatedQuestions = ({ related }: { related: string[] }) => {
	const preloadRelated = useCallback(async () => {
		const response = await fetch('/api/questions', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ questions: related, load: true })
		})

		if (!response.ok) throw await errorFromResponse(response)
	}, [related])

	useEffect(() => {
		preloadRelated().catch(console.error)
	}, [preloadRelated])

	return null
}

export default PreloadRelatedQuestions
