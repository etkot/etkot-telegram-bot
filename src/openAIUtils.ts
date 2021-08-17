import OpenAI, { Completion } from 'openai-api'
import {QuoteDocument} from './commands/quote'

const OAI_API_KEY: string = process.env.OAI_API_KEY || ''

const openai: OpenAI = new OpenAI(OAI_API_KEY)

const generate = async (randomizedQuotes: Array<QuoteDocument>): Promise<string> => {

    const input = randomizedQuotes.map((doc) => `${doc.quote}`).join('\n')

    // If only 1 quote, stop merkki has to be '.' with newline, it would just return nothing for some reason 
    const stop = randomizedQuotes.length === 1 ? "." : '\n'

    const response: Completion = await openai.complete({
        engine: 'davinci',
        prompt: input.slice(-3).match(/[\r\n]/) ? input : input + '\n',
        maxTokens: 128,
        temperature: 0.7, // randomness
        topP: 1,
        presencePenalty: 0.1,
        frequencyPenalty: 0.1,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: [stop],
    })
    
    return response.data.choices[0].text.split('\n').join('')
}

const oaiUtils = { generate }
export default oaiUtils
