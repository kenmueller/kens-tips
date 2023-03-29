import 'server-only'

if (!process.env.PASSWORD) throw new Error('Missing PASSWORD')

import { headers } from 'next/headers'

import HttpError from './error/http'
import ErrorCode from './error/code'

const verifyAuthenticationHeader = () => {
	const header = headers().get('Authentication')

	if (!header)
		throw new HttpError(ErrorCode.BadRequest, 'Missing authentication header')

	const [type, token] = header.trim().split(/\s+/)

	if (type !== 'Bearer')
		throw new HttpError(ErrorCode.BadRequest, 'Invalid authentication type')

	if (token !== process.env.PASSWORD!)
		throw new HttpError(ErrorCode.Unauthorized, 'Invalid authentication token')
}

export default verifyAuthenticationHeader
