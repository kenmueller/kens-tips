import { headers } from 'next/headers'
import _isBot from 'isbot'

const isBot = () => {
	const userAgent = headers().get('user-agent')
	return userAgent ? _isBot(userAgent) : true
}

export default isBot
