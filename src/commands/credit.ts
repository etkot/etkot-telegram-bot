import { ObjectId } from 'mongodb'
import { Commander } from '.'
import { getCollection } from '../mongoUtil'

interface Credit {
    from: string
    msg: number
    date: number
}
export interface CreditDocument {
    _id: ObjectId
    id: number
    username: string
    plus_credits?: Array<Credit>
    minus_credits?: Array<Credit>
}

export const addCredit = (from: string, to: { id: number; username: string }, msg_id: number, date: number): void => {
    const credit: Credit = {
        from,
        msg: msg_id,
        date,
    }

    getCollection<CreditDocument>('id_credit')
        .updateOne({ id: to.id }, { $push: { plus_credits: credit }, $set: { username: to.username } })
        .then((result) => {
            if (result.modifiedCount == 0) {
                getCollection<CreditDocument>('id_credit').insertOne({ ...to, plus_credits: [credit] })
            }
        })
}

export const removeCredit = (
    from: string,
    to: { id: number; username: string },
    msg_id: number,
    date: number
): void => {
    const credit: Credit = {
        from,
        msg: msg_id,
        date,
    }

    getCollection<CreditDocument>('id_credit')
        .updateOne({ id: to.id }, { $push: { minus_credits: credit }, $set: { username: to.username } })
        .then((result) => {
            if (result.modifiedCount == 0) {
                getCollection<CreditDocument>('id_credit').insertOne({ ...to, minus_credits: [credit] })
            }
        })
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['socialcredit', 'credit', 'sc'],
        arguments: [],
        help: 'Listaa kaikkien pisteet',

        func: (args, message, telegram) => {
            getCollection<CreditDocument>('id_credit')
                .find({})
                .toArray((err, docs) => {
                    const users: {
                        [key: string]: {
                            username: string
                            credits: number
                        }
                    } = {}
                    for (const doc of docs) {
                        if (users[doc.id] === undefined)
                            users[doc.id] = {
                                username: doc.username,
                                credits: 0,
                            }

                        users[doc.id].credits += doc.plus_credits?.length || 0
                        users[doc.id].credits -= doc.minus_credits?.length || 0
                    }

                    const sortable = Array.from(Object.entries(users)).sort(([, b], [, a]) => a.credits - b.credits)

                    let msg = '<b>Social credit:</b>\n'
                    for (const [, obj] of sortable) {
                        msg += `  ${obj.username}: ${obj.credits * 20}\n`
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
            const username = message.reply_to_message.from?.username || ''
            const id = message.reply_to_message.from?.id || 0

            telegram.sendSticker(
                message.chat.id,
                'CAACAgEAAx0CU40iHwACBFlhAAFO-Y7ptbHRQ7jLNhCy98FDivQAAgIAA39wRhwFzGTYNyIryCAE',
                {
                    disable_notification: true,
                    reply_to_message_id: message.reply_to_message.message_id,
                }
            )

            addCredit(fromUser, { id, username }, message.reply_to_message.message_id, message.date)
        },
    })

    commander.addCommand({
        commands: ['minussc', 'minuscredit', 'takesc', 'takecredit', 'removesc', 'removecredit'],
        arguments: [],
        help: 'Vähentää pisteitä tietyltä henkilöltä',

        func: (args, message, telegram) => {
            if (message.reply_to_message === undefined) return

            const fromUser = message.from?.username || ''
            const username = message.reply_to_message.from?.username || ''
            const id = message.reply_to_message.from?.id || 0

            telegram.sendSticker(
                message.chat.id,
                'CAACAgEAAx0CU40iHwACBFphAAFPOhzq7TKU3OKjp_37emmimtgAAgMAA39wRhxDWYhLWOdGzSAE',
                {
                    disable_notification: true,
                    reply_to_message_id: message.reply_to_message.message_id,
                }
            )

            removeCredit(fromUser, { id, username }, message.reply_to_message.message_id, message.date)
        },
    })

    // Sticker commands add and remove

    commander.addTrigger({
        ids: ['AgADAgADf3BGHA'],
        func: (message) => {
            if (message.reply_to_message === undefined) return

            const fromUser = message.from?.username || ''
            const username = message.reply_to_message.from?.username || ''
            const id = message.reply_to_message.from?.id || 0

            addCredit(fromUser, { id, username }, message.reply_to_message.message_id, message.date)
        },
    })
    commander.addTrigger({
        ids: ['AgADAwADf3BGHA'],
        func: (message) => {
            if (message.reply_to_message === undefined) return

            const fromUser = message.from?.username || ''
            const username = message.reply_to_message.from?.username || ''
            const id = message.reply_to_message.from?.id || 0

            removeCredit(fromUser, { id, username }, message.reply_to_message.message_id, message.date)
        },
    })
}
