import { getCollection } from '../mongoUtil'
import { Commander } from '.'

interface PerformerDocument {
    name: string
    score: number
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['weakperformers', 'heikot', 'weakpeople', 'weak'],
        arguments: [],
        help: 'Listaa heikot suorittajat',

        func: (args, message, telegram) => {
            getCollection<PerformerDocument>('heikot')
                .find({})
                .toArray((err, docs) => {
                    if (docs.length !== 0) {
                        let msg = '<b>Heikkojen suorittajien lista:</b>\n'
                        for (const doc of docs) {
                            msg += `  ${doc.name} x${doc.score}\n`
                        }
                        telegram.sendMessage(message.chat.id, msg, { disable_notification: true, parse_mode: 'html' })
                    } else {
                        telegram.sendMessage(message.chat.id, 'Kukaan ei ole suorittanut heikosti', {
                            disable_notification: true,
                            parse_mode: 'html',
                        })
                    }
                })
        },
    })

    commander.addCommand({
        commands: ['addperformer', 'lisääheikko', 'addh', 'ah'],
        arguments: ['<name>'],
        help: 'Lisää uuden heikon suorittaja',

        func: (args, message, telegram) => {
            const name = args[0].trim()
            const score = 1

            getCollection<PerformerDocument>('heikot').findOne({ name, score }, (err, result) => {
                if (result === null) {
                    getCollection<PerformerDocument>('heikot').insertOne({ name, score })
                    telegram.sendMessage(message.chat.id, `Heikko suorittaja lisätty`, { disable_notification: true })
                } else {
                    getCollection<PerformerDocument>('heikot').updateOne({ name: result.name }, { $inc: { score: 1 } })
                    telegram.sendMessage(message.chat.id, `Uusi heikko suoritus lisätty`, {
                        disable_notification: true,
                    })
                }
            })
        },
    })
}
