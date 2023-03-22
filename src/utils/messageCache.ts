import { ChatMessage } from '../types/open-ai'

const latestMessages: ChatMessage[] = []
const CACHE_SIZE = 8

export const addMessage = (message: ChatMessage): void => {
    const messageWithoutCommands = {
        ...message,
        content: message.content.replace(/\/\w+/, ''), // Remove /commands from message
    }

    latestMessages.push(messageWithoutCommands)
    if (latestMessages.length > CACHE_SIZE) {
        latestMessages.shift()
    }
}

export const getLatestMessages = (): ChatMessage[] => latestMessages

export const clearCache = (): void => {
    while (latestMessages.length > 0) {
        latestMessages.pop()
    }
}
