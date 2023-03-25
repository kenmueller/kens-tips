import Link from 'next/link'

import styles from './page.module.scss'
import { DiscussionEmbed } from 'disqus-react'
import CommentCount from '@/components/Disqus/CommentCount'
import Comments from '@/components/Disqus/Comments'

export const metadata = {
	title: "Ken's Tips",
	description: "Ken's Tips"
}

const QuestionPage = async () => {
	const question = 'How do I do this?'
	const views = 100
	const answer = 'You do this...'
	const relatedQuestions = ['How do I do that?', 'How do I do something else?']

	const commentConfig = {
		path: `/q/${encodeURIComponent(question)}`,
		id: 'aaaaaaaaaaaaaaaaaaaaa',
		title: question
	}

	return (
		<main className={styles.root}>
			<h1>{question}</h1>
			<p>Views: {views}</p>
			<CommentCount {...commentConfig} />
			<p>{answer}</p>
			<h3>Related Questions</h3>
			{relatedQuestions.map((question, index) => (
				<Link key={index} href={`/q/${encodeURIComponent(question)}`}>
					{question}
				</Link>
			))}
			<Comments {...commentConfig} />
		</main>
	)
}

export default QuestionPage
