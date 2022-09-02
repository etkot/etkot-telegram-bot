import OpenAI, { Completion } from "openai-api";
import { QuoteDocument } from "./commands/quote";

const OAI_API_KEY: string = process.env.OAI_API_KEY || "";
const openai: OpenAI = new OpenAI(OAI_API_KEY);

const generate = async (
  randomizedQuotes: Array<QuoteDocument>
): Promise<[string, number]> => {
  const input = randomizedQuotes.map((doc) => `${doc.quote}`).join("\n");

  let tokens = 0;
  tokens += input.length / 3;

  const response: Completion = await openai.complete({
    engine: "text-davinci-002",
    prompt: input.slice(-3).match(/[\r\n]/) ? input : input + "\n",
    maxTokens: 128,
    temperature: 0.7, // randomness
    topP: 1,
    presencePenalty: 0.1,
    frequencyPenalty: 0.1,
    bestOf: 1,
    n: 1,
    stream: false,
  });

  tokens += response.data.choices[0].logprobs?.tokens.length || 0;

  return [response.data.choices[0].text.replace(/([.]*[\n]+)/g, ". "), tokens];
};

// Replace all question marks with '' in prompt
const answerBasePromptGen = (prompt: string) =>
  `Q: Missä kannattaa syödä kouluruokaa?
A: Jokainen ravintola on yhtä hyvä.

Q: Tehtiinkö Bosniassa sotarikoksia?
A: Ei tehty!

Q: Mikä on mangolassin resepti?
A: Mangolassin resepti sisältää mangoja ja meemejä.

Q: Onko huomenna hyvä päivä?
A: Kyllä on!

Q: ${prompt.replace(/\?/g, "")}?
A:`;

const answer = async (question: string): Promise<[string, number]> => {
  let tokens = 0;
  tokens += question.length / 3;

  const { data }: Completion = await openai.complete({
    engine: "text-davinci-002",
    prompt: answerBasePromptGen(question),
    temperature: 0.27,
    maxTokens: 100,
    topP: 1,
    frequencyPenalty: 1.68,
    presencePenalty: 1.62,
    logprobs: 1,
  });

  tokens += data.choices[0].logprobs?.tokens.length || 0;

  return [data.choices[0].text, tokens];
};

const mondayQuoteBasePromptGen = (topic: string) => `
Topic: Dreams
Motivational quote: All our dreams can come true—if we have the courage to pursue them.

Topic: Success
Motivational quote: Today is your day for success! Just do it!

Topic: ${topic}
Motivational quote:`;

const topics = ["Monday", "Happiness", "Failure", "Motivation"];

const mondayQuote = async (topic?: string): Promise<string> => {
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const { data }: Completion = await openai.complete({
    engine: "text-davinci-002",
    prompt: mondayQuoteBasePromptGen(topic || randomTopic),
    temperature: 0.55,
    maxTokens: 60,
    topP: 0.9,
    frequencyPenalty: 0.5,
    presencePenalty: 0.2,
    stop: ["\n"],
  });

  return data.choices[0].text;
};

const oaiUtils = { generate, answer, mondayQuote };
export default oaiUtils;
