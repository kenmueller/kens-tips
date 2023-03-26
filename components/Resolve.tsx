const Resolve = async <Value,>({ promise }: { promise: Promise<Value> }) => {
	await promise
	return null
}

export default Resolve
