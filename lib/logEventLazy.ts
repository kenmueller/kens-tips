const logEvent = async (
	...args: Parameters<typeof import('./logEvent').default>
) => {
	const { default: _logEvent } = await import('./logEvent')
	_logEvent(...args)
}

export default logEvent
