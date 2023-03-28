import { NextRequest, NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'
import updateViews from '@/lib/question/updateViews'

export const POST = async (
	_request: NextRequest,
	{ params: { id } }: { params: { id: string } }
) => {
	try {
		await updateViews(id)
		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
