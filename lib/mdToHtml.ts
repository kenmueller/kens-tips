import 'server-only'

import { Converter } from 'showdown'

const converter = new Converter()

const mdToHtml = (md: string) => converter.makeHtml(md)

export default mdToHtml
