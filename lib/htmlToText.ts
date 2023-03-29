import 'server-only'

import { convert } from 'html-to-text'

const htmlToText = (html: string) => convert(html, { wordwrap: null })

export default htmlToText
