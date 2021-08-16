import OpenAI from 'openai-api'

const OAI_API_KEY: string = process.env.OAI_API_KEY || ''

const openai: OpenAI = new OpenAI(OAI_API_KEY)

const generate = async (input: string): Promise<string> => {
    const response: any = await openai.complete({
        engine: 'davinci',
        prompt: input.slice(-3).match(/[\r\n]/) ? input : input + '\n',
        maxTokens: 64,
        temperature: 0.7, // randomness
        topP: 1,
        presencePenalty: 0.2,
        frequencyPenalty: 0.2,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ['\n'],
    })
    return response.data.choices[0].text
}

const oaiUtils = { generate }
export default oaiUtils
