import 'server-only'

import { Converter } from 'showdown'

// @ts-expect-error Missing type declarations
import htmlEscape from 'showdown-htmlescape'

const converter = new Converter({ extensions: [htmlEscape] })

const mdToHtml = (md: string) => converter.makeHtml(md)

export default mdToHtml
