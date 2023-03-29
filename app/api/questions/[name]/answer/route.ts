import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import updateQuestionAnswer from '@/lib/question/updateAnswer'
import verifyAuthenticationHeader from '@/lib/verifyAuthenticationHeader'
import Model, { MODELS } from '@/lib/openai/model'

interface Body {
	prompt: string
	model?: Model
}

export const PATCH = async (
	request: NextRequest,
	{ params: { name } }: { params: { name: string } }
) => {
	try {
		verifyAuthenticationHeader()

		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Invalid content type')

		const body: Body = await request.json()

		if (!(typeof body === 'object' && body))
			throw new HttpError(ErrorCode.BadRequest, 'Invalid body')

		const { prompt, model } = body

		if (
			!(
				typeof prompt === 'string' &&
				prompt.trim() &&
				(model === undefined || MODELS.includes(model))
			)
		)
			throw new HttpError(ErrorCode.BadRequest, 'Invalid data')

		const normalizedPrompt = prompt.trim()
		const answer = await updateQuestionAnswer(name, normalizedPrompt, model)

		return new NextResponse(answer)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
