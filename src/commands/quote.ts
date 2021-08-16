import { ObjectId } from 'mongodb'
import { Commander } from '.'
import { getCollection } from '../mongoUtil'
import oaiUtils from '../openAIUtils'

interface QuoteDocument {
    _id: ObjectId
    name: string
    quote: string
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

        func: (args, message, telegram) => {
            getCollection<QuoteDocument>('quotes')
                .aggregate([{ $group: { _id: '$name', count: { $sum: 1 } } }])
                .toArray((err, res) => {
                    const result = res as unknown as [{ _id: string; count: number }]

                    result.sort((a, b) => {
                        if (b.count - a.count !== 0) {
                            return b.count - a.count
                        }
                        if (a._id > b._id) return 1
                        if (a._id < b._id) return -1
                        return 0
                    })

                    let total = 0
                    let str = '<b>Quote stats</b>\n'
                    for (const user of result) {
                        str += `${user._id}: ${user.count}\n`
                        total += user.count
                    }
                    str += `<i>Total:</i> <b>${total}</b>`

                    telegram.sendMessage(message.chat.id, str, { disable_notification: true, parse_mode: 'HTML' })
                })
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
                        const randomizedQuotes = docs.sort(() => 0.5 - Math.random()).slice(0, 5)

                        const selectedQuotes = randomizedQuotes.map((doc) => `"${doc.quote}"`).join('\n')

                        oaiUtils
                            .generate(`"${selectedQuotes}`)
                            .then((generatedQuote) =>
                                telegram.sendMessage(message.chat.id, `${generatedQuote} - AI-${docs[0].name}`, {
                                    disable_notification: true,
                                })
                            )
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
