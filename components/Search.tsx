'use client'

import { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import logEvent from '@/lib/logEvent/lazy'

import styles from './Search.module.scss'

const Search = () => {
	const router = useRouter()

	const [question, setQuestion] = useState('')
	const normalizedQuestion = question.trim()

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setQuestion(event.target.value)
		},
		[setQuestion]
	)

	const onSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			logEvent('search', {
				page_path: window.location.pathname,
				page_title: document.title,
				search_term: normalizedQuestion
			}).catch(console.error)

			if (normalizedQuestion)
				router.push(`/q/${encodeURIComponent(normalizedQuestion)}`)
		},
		[router, normalizedQuestion]
	)

	return (
		<form className={styles.root} onSubmit={onSubmit}>
			<input
				className={styles.input}
				value={question}
				placeholder="Question"
				onChange={onChange}
			/>
			<button className={styles.submit} disabled={!normalizedQuestion}>
				Search
			</button>
		</form>
	)
}

export default Search
