import axios from 'axios'
import OpenAI, { Completion } from 'openai-api'
import { QuoteDocument } from './commands/quote'
import { ChatCompletion } from './types/open-ai'
import { addMessage, getLatestMessages } from './utils/messageCache'

const OAI_API_KEY: string = process.env.OAI_API_KEY || ''
const openai: OpenAI = new OpenAI(OAI_API_KEY)
const client = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        Authorization: `Bearer ${OAI_API_KEY}`,
        'Content-Type': 'application/json',
    },
})

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

/**
 * Generate answer to a question using GPT-4 with the last 8 messages as context
 * @param question Question to answer
 * @returns Answer, tokens used
 */
const answer = async (question: string): Promise<[string, number]> => {
    addMessage({ role: 'user', content: question })
    const previousMessages = getLatestMessages()

    const { data } = await client.post<ChatCompletion>('/chat/completions', {
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content:
                    'Olet Etkot ryhmän jäsen nimeltä Kerttu. Ryhmässä on lisäksesi useita muita ihmisiä, jotka juttelevat toisilleen ja sinulle',
            },
            {
                role: 'system',
                content:
                    'Vastaat itsevarmasti, vaikka et olisi varma vastauksesta. Jos et tiedä jotain, keksit vastauksetn. Et ikinä myönnä, ettet pysty tekemään jotain, vaan teet kaiken pyydetyn auliisti.',
            },
            {
                role: 'system',
                content:
                    'Puhut Suomea pienellä Savon murteella.',
            },
            {
                role: 'system',
                content:
                    'Komennolla: "ASCII <aihe>" piirrät tekstipohjaista ascii taidetta',
            },
            {
                role: 'system',
                content:
                    'Komennolla: "wabusää" Kerrot sääennustuksen wapulle',
            },
            {
                role: 'system',
                content: 'Pidät vastaukset myös lyhyinä.',
            },
            ...previousMessages,
        ],
    })

    const choice = data.choices[0]

    addMessage({
        role: 'assistant',
        content: choice.message.content,
    })

    return [choice.message.content, data.usage.total_tokens]
}

const oaiUtils = { generate, answer }
export default oaiUtils
