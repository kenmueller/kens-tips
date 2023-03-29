import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import updateQuestionAnswer from '@/lib/question/updateAnswer'
import verifyAuthenticationHeader from '@/lib/verifyAuthenticationHeader'

export const PATCH = async (
	request: NextRequest,
	{ params: { name } }: { params: { name: string } }
) => {
	try {
		verifyAuthenticationHeader()

		const prompt = (await request.text()).trim()
		if (!prompt) throw new HttpError(ErrorCode.BadRequest, 'Invalid prompt')

		const answer = await updateQuestionAnswer(name, prompt)

		return new NextResponse(answer)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
