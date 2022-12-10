import OpenAI, { Completion } from 'openai-api'
import { QuoteDocument } from './commands/quote'

const OAI_API_KEY: string = process.env.OAI_API_KEY || ''
const openai: OpenAI = new OpenAI(OAI_API_KEY)

const generate = async (randomizedQuotes: Array<QuoteDocument>): Promise<[string, number]> => {
    const input = randomizedQuotes.map((doc, i) => `${i + 1}. ${doc.quote}`).join('\n')

    const prompt = `Olen lainauksien generointi kone, jolle syötetään lainauksia henkilöltä ilman kontekstia ja joka generoi uuden samaan tyyliin.

${input}
${randomizedQuotes.length + 1}.`

    let tokens = 0
    tokens += input.length / 3

    const response: Completion = await openai.complete({
        engine: 'text-davinci-003',
        prompt,
        maxTokens: 128,
        temperature: 0.5,
        topP: 1,
        presencePenalty: 0.33,
        frequencyPenalty: 0.33,
        stop: ['\n'],
    })

    tokens += response.data.choices[0].logprobs?.tokens.length || 0

    return [response.data.choices[0].text.replace(/([.]*[\n]+)/g, '. '), tokens]
}

const answerBasePromptGen = (prompt: string) =>
    `Olen humoristinen ja sanavalmis kone, joka tietää vastauksen myös outoihin ja hämmentäviin kysymyksiin.
Vastaan lyhyillä ja ytimekkäillä vastauksilla.

Q: ${prompt.replace(/\?/g, '')}?
A:`

const answer = async (question: string): Promise<[string, number]> => {
    let tokens = 0
    tokens += question.length / 3

    const { data }: Completion = await openai.complete({
        engine: 'text-davinci-003',
        prompt: answerBasePromptGen(question),
        temperature: 0.3,
        maxTokens: 100,
        topP: 1,
        frequencyPenalty: 0.24,
        presencePenalty: 0.25,
        stop: ['\n'],
    })

    tokens += data.choices[0].logprobs?.tokens.length || 0

    return [data.choices[0].text, tokens]
}

const mondayQuoteBasePromptGen = (
    topic: string
) => `I'm a machine that specializes in generating motivational quotes for your Monday mornings from the given topics.

Topic: Dreams
Motivational quote: All our dreams can come true—if we have the courage to pursue them.

Topic: Success
Motivational quote: Today is your day for success! Just do it!

Topic: ${topic}
Motivational quote:`

const topics = ['Monday', 'Happiness', 'Failure', 'Motivation']

const mondayQuote = async (topic?: string): Promise<string> => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    const { data }: Completion = await openai.complete({
        engine: 'text-davinci-003',
        prompt: mondayQuoteBasePromptGen(topic || randomTopic),
        temperature: 0.55,
        maxTokens: 60,
        topP: 0.9,
        frequencyPenalty: 0.5,
        presencePenalty: 0.2,
        stop: ['\n'],
    })

    return data.choices[0].text
}

const oaiUtils = { generate, answer, mondayQuote }
export default oaiUtils
