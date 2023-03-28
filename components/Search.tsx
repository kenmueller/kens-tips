'use client'

import {
	ChangeEvent,
	FormEvent,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import logEvent from '@/lib/logEvent/lazy'

import styles from './Search.module.scss'

const Search = ({
	className,
	autoFocus = false
}: {
	className?: string
	autoFocus?: boolean
}) => {
	const router = useRouter()

	const input = useRef<HTMLInputElement | null>(null)

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

	useEffect(() => {
		if (autoFocus) input.current?.focus()
	}, [input, autoFocus])

	return (
		<form className={cx(styles.root, className)} onSubmit={onSubmit}>
			<div className={styles.inputContainer}>
				<input
					ref={input}
					className={styles.input}
					value={question}
					placeholder="Question"
					onChange={onChange}
				/>
				<FontAwesomeIcon className={styles.icon} icon={faMagnifyingGlass} />
			</div>
			<button className={styles.submit} disabled={!normalizedQuestion}>
				Search
			</button>
		</form>
	)
}

export default Search
