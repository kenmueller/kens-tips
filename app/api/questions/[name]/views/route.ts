import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import updateViews from '@/lib/question/updateViews'

export const POST = async (
	_request: NextRequest,
	{ params: { name } }: { params: { name: string } }
) => {
	try {
		await updateViews(name)
		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
