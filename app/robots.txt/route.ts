if (!process.env.NEXT_PUBLIC_ORIGIN)
	throw new Error('Missing NEXT_PUBLIC_ORIGIN')

import { NextResponse } from 'next/server'

import errorFromUnknown from '@/lib/error/fromUnknown'

export const GET = async () => {
	try {
		return new NextResponse(
			`User-agent: *
Sitemap: ${process.env.NEXT_PUBLIC_ORIGIN!}/sitemap.xml`,
			{
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'text/plain'
				}
			}
		)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
