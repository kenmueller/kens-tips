import 'server-only'

import truncate from 'truncate'

import htmlToText from './htmlToText'

const MAX_DESCRIPTION_LENGTH = 350

const htmlToDescription = (html: string) =>
	truncate(htmlToText(html), MAX_DESCRIPTION_LENGTH)

export default htmlToDescription
