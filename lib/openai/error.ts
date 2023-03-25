export default interface OpenAIError {
	response: {
		data: {
			error: {
				message: string
			}
		}
	}
}
