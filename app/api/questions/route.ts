import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import ErrorCode from '@/lib/error/code'
import HttpError from '@/lib/error/http'
import saveQuestions from '@/lib/question/save'

export const POST = async (request: NextRequest) => {
	try {
		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Invalid content type')

		const questions: string[] = await request.json()

		if (
			!(
				Array.isArray(questions) &&
				questions.every(question => typeof question === 'string')
			)
		)
			throw new HttpError(ErrorCode.BadRequest, 'Invalid questions')

		const normalizedQuestions = questions
			.map(question => question.trim())
			.filter(Boolean)

		const uniqueNormalizedQuestions = Array.from(new Set(normalizedQuestions))

		await saveQuestions(uniqueNormalizedQuestions)

		return NextResponse.json(uniqueNormalizedQuestions)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
