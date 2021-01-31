import { Commander } from '.'
import { getCollection } from '../mongoUtil'

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['quote', 'q', 'quoite', 'quoye'],
        arguments: ['[name]'],
        help: 'Lähettää satunnaisen quoten',

        func: (args, message, telegram) => {
            let query: any
            if (args.length > 0) {
                query.name = new RegExp(`^${args[0]}$`, 'i')
            }

            getCollection('quotes')
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
            const name = args.shift()
            const quote = args.join(' ')

            getCollection('quotes').findOne({ name, quote }, (err, result) => {
                if (result === null) {
                    getCollection('quotes').insertOne({ name, quote })
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
            getCollection('quotes')
                .aggregate([{ $group: { _id: '$name', count: { $sum: 1 } } }])
                .toArray((err, result) => {
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
}
