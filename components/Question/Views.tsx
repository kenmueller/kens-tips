'use client'

import { useCallback, useEffect, useState } from 'react'

import Question from '@/lib/question'
import errorFromResponse from '@/lib/error/fromResponse'

const QuestionViews = ({
	question,
	bot
}: {
	question: Question
	bot: boolean
}) => {
	const [views, setViews] = useState(question.views)

	const updateViews = useCallback(async () => {
		const response = await fetch(
			`/api/questions/${encodeURIComponent(question.id)}/views`,
			{ method: 'POST' }
		)

		if (!response.ok) throw await errorFromResponse(response)

		setViews(views => views + 1)
	}, [question, setViews])

	useEffect(() => {
		if (!bot) updateViews().catch(console.error)
	}, [bot, updateViews])

	return (
		<p>
			{views} view{views === 1 ? '' : 's'}
		</p>
	)
}

export default QuestionViews
