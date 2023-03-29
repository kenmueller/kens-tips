import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import ErrorCode from '@/lib/error/code'
import HttpError from '@/lib/error/http'
import saveUnloadedQuestions from '@/lib/question/saveUnloaded'
import saveLoadedQuestions from '@/lib/question/saveLoaded'
import Model, { DEFAULT_MODEL, MODELS } from '@/lib/openai/model'
import verifyAuthenticationHeader from '@/lib/verifyAuthenticationHeader'

interface Body {
	questions: string[]
	load: boolean
	model?: Model
}

export const POST = async (request: NextRequest) => {
	try {
		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Invalid content type')

		const body: Body = await request.json()

		if (!(typeof body === 'object' && body))
			throw new HttpError(ErrorCode.BadRequest, 'Invalid body')

		const { questions, load, model } = body

		if (
			!(
				Array.isArray(questions) &&
				questions.every(question => typeof question === 'string') &&
				typeof load === 'boolean' &&
				(model === undefined || MODELS.includes(model))
			)
		)
			throw new HttpError(ErrorCode.BadRequest, 'Invalid data')

		// If using a custom model, require authentication
		if (!(model === undefined || model === DEFAULT_MODEL))
			verifyAuthenticationHeader()

		const normalizedQuestions = questions
			.map(question => question.trim())
			.filter(Boolean)

		const uniqueNormalizedQuestions = Array.from(new Set(normalizedQuestions))

		const results = await (load
			? saveLoadedQuestions(uniqueNormalizedQuestions, model)
			: saveUnloadedQuestions(uniqueNormalizedQuestions))

		return NextResponse.json(results)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
