import { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import './layout.scss'

const inter = Inter({ subsets: ['latin'] })

const RootLayout = ({ children }: { children: ReactNode }) => (
	<html lang="en" dir="ltr">
		<body className={inter.className}>{children}</body>
	</html>
)

export default RootLayout
