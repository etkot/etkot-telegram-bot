import { ObjectId } from 'mongodb'
import { Commander } from '.'
import { getCollection } from '../mongoUtil'

interface Credit {
    from: string
    msg: number
    date: number
}
interface CreditDocument {
    _id: ObjectId
    username: string
    plus_credits?: Array<Credit>
    minus_credits?: Array<Credit>
}

const addCredit = (from: string, to: string, msg_id: number, date: number) => {
    const credit: Credit = {
        from,
        msg: msg_id,
        date,
    }

    getCollection<CreditDocument>('credit')
        .updateOne({ username: to }, { $push: { plus_credits: credit } })
        .then((result) => {
            if (result.modifiedCount == 0) {
                getCollection<CreditDocument>('credit').insertOne({ username: to, plus_credits: [credit] })
            }
        })
}

const removeCredit = (from: string, to: string, msg_id: number, date: number) => {
    const credit: Credit = {
        from,
        msg: msg_id,
        date,
    }

    getCollection<CreditDocument>('credit')
        .updateOne({ username: to }, { $push: { minus_credits: credit } })
        .then((result) => {
            if (result.modifiedCount == 0) {
                getCollection<CreditDocument>('credit').insertOne({ username: to, minus_credits: [credit] })
            }
        })
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['socialcredit', 'credit', 'sc'],
        arguments: [],
        help: 'Listaa kaikkien pisteet',

        func: (args, message, telegram) => {
            getCollection<CreditDocument>('credit')
                .find({})
                .toArray((err, docs) => {
                    const users: { [key: string]: number } = {}
                    for (const doc of docs) {
                        if (users[doc.username] === undefined) users[doc.username] = 0

                        users[doc.username] += doc.plus_credits?.length || 0
                        users[doc.username] -= doc.minus_credits?.length || 0
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

    // Text commands add and remove

    commander.addCommand({
        commands: ['plussc', 'pluscredit', 'givesc', 'givecredit', 'addsc', 'addcredit'],
        arguments: [],
        help: 'Lisää pisteitä tietylle henkilölle',

        func: (args, message, telegram) => {
            if (message.reply_to_message === undefined) return

            const fromUser = message.from?.username || ''
            const toUser = message.reply_to_message.from?.username || ''

            telegram.sendSticker(
                message.chat.id,
                'CAACAgEAAx0CU40iHwACBFlhAAFO-Y7ptbHRQ7jLNhCy98FDivQAAgIAA39wRhwFzGTYNyIryCAE',
                {
                    disable_notification: true,
                    reply_to_message_id: message.reply_to_message.message_id,
                }
            )

            addCredit(fromUser, toUser, message.reply_to_message.message_id, message.date)
        },
    })

    commander.addCommand({
        commands: ['minussc', 'minuscredit', 'takesc', 'takecredit', 'removesc', 'removecredit'],
        arguments: [],
        help: 'Vähentää pisteitä tietyltä henkilöltä',

        func: (args, message, telegram) => {
            if (message.reply_to_message === undefined) return

            const fromUser = message.from?.username || ''
            const toUser = message.reply_to_message.from?.username || ''

            telegram.sendSticker(
                message.chat.id,
                'CAACAgEAAx0CU40iHwACBFphAAFPOhzq7TKU3OKjp_37emmimtgAAgMAA39wRhxDWYhLWOdGzSAE',
                {
                    disable_notification: true,
                    reply_to_message_id: message.reply_to_message.message_id,
                }
            )

            removeCredit(fromUser, toUser, message.reply_to_message.message_id, message.date)
        },
    })

    // Sticker commands add and remove

    commander.addTrigger({
        ids: ['AgADAgADf3BGHA'],
        func: (message) => {
            if (message.reply_to_message === undefined) return

            const fromUser = message.from?.username || ''
            const toUser = message.reply_to_message.from?.username || ''

            addCredit(fromUser, toUser, message.reply_to_message.message_id, message.date)
        },
    })
    commander.addTrigger({
        ids: ['AgADAwADf3BGHA'],
        func: (message) => {
            if (message.reply_to_message === undefined) return

            const fromUser = message.from?.username || ''
            const toUser = message.reply_to_message.from?.username || ''

            removeCredit(fromUser, toUser, message.reply_to_message.message_id, message.date)
        },
    })
}
