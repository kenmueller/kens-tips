'use client'

import { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import styles from './Search.module.scss'

const Search = () => {
	const router = useRouter()
	const [question, setQuestion] = useState('')

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setQuestion(event.target.value)
		},
		[setQuestion]
	)

	const onSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			router.push(`/q/${encodeURIComponent(question)}`)
		},
		[router, question]
	)

	return (
		<form className={styles.root} onSubmit={onSubmit}>
			<input value={question} placeholder="Question" onChange={onChange} />
			<button>Search</button>
		</form>
	)
}

export default Search
