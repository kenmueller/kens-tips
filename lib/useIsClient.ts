import 'client-only'

import { useEffect, useState } from 'react'

const useIsClient = () => {
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [setIsClient])

	return isClient
}

export default useIsClient
