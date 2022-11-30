import { ObjectId } from 'mongodb'
import { Commander } from '.'
import { getCollection } from '../mongoUtil'
import oaiUtils from '../openAIUtils'
import { addUsage } from './ai-usage'

export interface QuoteDocument {
    _id: ObjectId
    name: string
    quote: string
}

interface QuoteStats {
    message: string
    pageCount: number
}

const getQuoteStats = (page: number) => {
    return new Promise<QuoteStats>((resolve, reject) => {
        const len = 15
        const start = page * len

        getCollection<QuoteDocument>('quotes')
            .aggregate<{ docs: { name: string; count: number }[]; quoteCount: number; docsCount: number }>([
                { $group: { _id: '$name', count: { $sum: 1 } } }, // Count users' quotes
                { $sort: { count: -1, _id: 1 } }, // Sort user from most quotes to least and by name if quote count is same
                { $group: { _id: null, docs: { $push: { name: '$_id', count: '$count' } } } }, // Group all users into a single document
                {
                    $project: {
                        docs: { $slice: ['$docs', start, len] }, // take the first 10 elements
                        quoteCount: { $sum: '$docs.count' }, // Count all quotes
                        docsCount: { $size: '$docs' }, // Count all documents
                    },
                },
            ])
            .toArray((err, [result]) => {
                const pageCount = Math.ceil(result.docsCount / len)

                let message = `<b>Quote stats</b>  (<i>Total:</i> <b>${result.quoteCount}</b>)\n`
                for (const user of result.docs) {
                    message += `${user.name}: ${user.count}\n`
                }

                resolve({ message, pageCount })
            })
    })
}

const genQuoteStatsReplyMarkup = (page: number, pageCount: number) => {
    return {
        objectName: 'InlineKeyboardMarkup',
        inline_keyboard: [
            [
                {
                    objectName: 'InlineKeyboardButton',
                    text: '<< 1',
                    callback_data: `qs 0 ${page}`,
                },
                {
                    objectName: 'InlineKeyboardButton',
                    text: `< ${Math.max(page - 1, 0) + 1}`,
                    callback_data: `qs ${Math.max(page - 1, 0)} ${page}`,
                },
                {
                    objectName: 'InlineKeyboardButton',
                    text: (page + 1).toString(),
                    callback_data: `qs ${page} ${page}`,
                },
                {
                    objectName: 'InlineKeyboardButton',
                    text: `${Math.min(page + 1, pageCount - 1) + 1} >`,
                    callback_data: `qs ${Math.min(page + 1, pageCount - 1)} ${page}`,
                },
                {
                    objectName: 'InlineKeyboardButton',
                    text: `${pageCount} >>`,
                    callback_data: `qs ${pageCount - 1} ${page}`,
                },
            ],
        ],
    }
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['quote', 'q', 'quoite', 'quoye'],
        arguments: ['[name]'],
        help: 'Lähettää satunnaisen quoten',

        func: (args, message, telegram) => {
            const query: { name?: RegExp } = {}
            if (args.length > 0) {
                query.name = new RegExp(`^${args[0]}$`, 'i')
            }

            getCollection<QuoteDocument>('quotes')
                .find(query)
                .toArray((err, docs) => {
                    if (docs.length > 0) {
                        const selectedQuote = docs[Math.floor(Math.random() * docs.length)]
                        telegram.sendMessage(message.chat.id, `"${selectedQuote.quote}" - ${selectedQuote.name}`, {
                            disable_notification: true,
                        })
                    } else {
                        telegram.sendMessage(message.chat.id, 'Tuolta henkilöltä ei löydy quoteja :(', {
                            disable_notification: true,
                        })
                    }
                })
        },
    })

    commander.addCommand({
        commands: ['addq', 'aq'],
        arguments: ['<name>', '<quote>'],
        help: 'Lisää uuden quoten käyttäjälle',

        func: (args, message, telegram) => {
            const name = args.shift() as string
            const quote = args.join(' ')

            getCollection<QuoteDocument>('quotes').findOne({ name, quote }, (err, result) => {
                if (result === null) {
                    getCollection<QuoteDocument>('quotes').insertOne({ name, quote })
                    telegram.sendMessage(message.chat.id, `Quote lisätty`, { disable_notification: true })
                } else {
                    telegram.sendMessage(message.chat.id, `Quote on jo olemassa`, { disable_notification: true })
                }
            })
        },
    })

    commander.addCommand({
        commands: ['quotestats', 'qs', 'qstats'],
        arguments: [],
        help: 'Näyttää kuinka monta quotea käyttäjillä on',

        func: async (args, msg, telegram) => {
            const page = 0
            const { message, pageCount } = await getQuoteStats(page)

            telegram.sendMessage(msg.chat.id, message, {
                disable_notification: true,
                parse_mode: 'HTML',
                reply_markup: genQuoteStatsReplyMarkup(page, pageCount),
            })
        },
    })

    commander.addCallbackQuery({
        command: 'qs',
        func: async (args, query, telegram) => {
            const page = Number(args[0])
            const oldPage = Number(args[1])

            if (page === oldPage) return

            const { message, pageCount } = await getQuoteStats(page)

            telegram
                .editMessageText(message, {
                    chat_id: query.message?.chat.id,
                    message_id: query.message?.message_id,
                    parse_mode: 'HTML',
                    reply_markup: genQuoteStatsReplyMarkup(page, pageCount),
                })
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                .catch((err) => {})
        },
    })

    commander.addCommand({
        commands: ['generatequote', 'gq'],
        arguments: ['[name]'],
        help: 'generoi quoten henkilölle',

        func: (args, message, telegram) => {
            const query: { name?: RegExp } = {}
            if (args.length > 0) {
                query.name = new RegExp(`^${args[0]}$`, 'i')
            }

            getCollection<QuoteDocument>('quotes')
                .find(query)
                .toArray((err, docs) => {
                    if (docs.length > 0) {
                        if (!query.name) {
                            const selectedPerson = docs[Math.floor(Math.random() * docs.length)].name
                            docs = docs.filter((quote) => quote.name.toLowerCase === selectedPerson.toLowerCase)
                        }

                        // Randomizes quote array and pick 8 of them to be sent to openAI generator
                        const amountOfQuotes = 8
                        const randomizedQuotes = docs.sort(() => 0.5 - Math.random()).slice(0, amountOfQuotes)

                        oaiUtils
                            .generate(randomizedQuotes)
                            .then(([generatedQuote, tokens]) => {
                                addUsage(message.from?.id || 0, message.from?.username || '', tokens)
                                if (generatedQuote.length) {
                                    telegram.sendMessage(message.chat.id, `"${generatedQuote}" - AI-${docs[0].name}`, {
                                        disable_notification: true,
                                    })
                                } else {
                                    telegram.sendMessage(message.chat.id, 'error: returned empty :(', {
                                        disable_notification: true,
                                    })
                                }
                            })
                            .catch((res) => {
                                console.error('Could not generate quote:', res.response.status, res.response.statusText)
                            })
                    } else {
                        telegram.sendMessage(message.chat.id, 'Tuolta henkilöltä ei löydy quoteja :(', {
                            disable_notification: true,
                        })
                    }
                })
        },
    })
}
