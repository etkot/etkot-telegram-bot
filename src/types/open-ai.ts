export type ChatMessage = {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export type ChatCompletion = {
    id: string
    object: 'chat.completion'
    created: number
    model: string
    usage: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
    choices: Array<{
        message: ChatMessage
        finish_reason: 'stop'
        index: number
    }>
}
