if (!process.env.OPENAI_MODEL) throw new Error('Missing OPENAI_MODEL')

type Model = (typeof MODELS)[number]

export const MODELS = ['gpt-3.5-turbo', 'gpt-4'] as const
export const DEFAULT_MODEL = process.env.OPENAI_MODEL! as Model

export default Model
