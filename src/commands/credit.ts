import { Commander } from '.'
import { getCollection } from '../mongoUtil'

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['socialcredit', 'credit', 'sc'],
        arguments: [],
        help: 'Listaa kaikkien pisteet',

        func: (args, message, telegram) => {
            getCollection('credit')
                .find({})
                .toArray((err, docs: Array<any>) => {
                    const users: { [key: string]: any } = {}
                    for (const doc of docs) {
                        if (users[doc.username] === undefined) users[doc.username] = 0

                        users[doc.username] += doc.plus_credits.length
                        users[doc.username] -= doc.minus_credits.length
                    }

                    const sortable = []
                    for (const user in users) {
                        sortable.push({ user, credit: users[user] })
                    }

                    sortable.sort(function (a, b) {
                        return b.credit - a.credit
                    })

                    let msg = '<b>Social credit:</b>\n'
                    for (const obj of sortable) {
                        msg += `  ${obj.user}: ${obj.credit * 20}\n`
                    }

                    telegram.sendMessage(message.chat.id, msg, { disable_notification: true, parse_mode: 'html' })
                })
        },
    })

    commander.addTrigger({
        ids: ['AgADAgADf3BGHA'],
        func: (message) => {
            if (message.reply_to_message === undefined) return

            const fromUser = message.from?.username
            const toUser = message.reply_to_message.from?.username

            const credit = {
                from: fromUser,
                msg: message.reply_to_message.message_id,
                date: message.date,
            }

            getCollection('credit')
                .updateOne({ username: toUser }, { $push: { plus_credits: credit } })
                .then((result) => {
                    if (result.modifiedCount == 0) {
                        getCollection('credit').insertOne({ username: toUser, plus_credits: [credit] })
                    }
                })
        },
    })
    commander.addTrigger({
        ids: ['AgADAwADf3BGHA'],
        func: (message) => {
            if (message.reply_to_message === undefined) return

            const fromUser = message.from?.username
            const toUser = message.reply_to_message.from?.username

            const credit = {
                from: fromUser,
                msg: message.reply_to_message.message_id,
                date: message.date,
            }

            getCollection('credit')
                .updateOne({ username: toUser }, { $push: { minus_credits: credit } })
                .then((result) => {
                    if (result.modifiedCount == 0) {
                        getCollection('credit').insertOne({ username: toUser, minus_credits: [credit] })
                    }
                })
        },
    })
}
