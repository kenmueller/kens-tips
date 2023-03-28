const logEventLazy = async (
	...args: Parameters<typeof import('.').default>
) => {
	const { default: logEvent } = await import('.')
	logEvent(...args)
}

export default logEventLazy
