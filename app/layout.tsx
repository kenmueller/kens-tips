import { config } from '@fortawesome/fontawesome-svg-core'

config.autoAddCss = false

import { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import favicon from '@/assets/favicon.png'

import theme from '@/styles/theme.module.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './layout.scss'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
	applicationName: "Ken's Tips",
	authors: [{ name: 'Ken Mueller', url: 'https://matchwho.io' }],
	publisher: "Ken's Tips",
	creator: 'Ken Mueller',
	themeColor: theme.dark,
	manifest: '/manifest.webmanifest',
	icons: favicon.src
}

const RootLayout = ({ children }: { children: ReactNode }) => (
	<html lang="en" dir="ltr">
		<body className={inter.className}>{children}</body>
	</html>
)

export default RootLayout
