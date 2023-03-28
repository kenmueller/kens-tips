import { getAnalytics, logEvent as _logEvent } from 'firebase/analytics'

import app from '@/lib/firebase'

const analytics = getAnalytics(app)

const logEvent = (event: string, params: Record<string, unknown>) => {
	_logEvent(analytics, event, params)
}

export default logEvent
