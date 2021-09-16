import { CronJob } from 'cron'
import { Commander } from '.'
import { getCollection } from '../mongoUtil'

interface BirthdayDoc {
    userid: number
    username: string
    day: number
    month: number
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['setbirthday', 'setbd', 'sbd'],
        arguments: ['<date>'],
        help: 'Asettaa käyttäjän syntymäpäivän',

        func: async (args, message, telegram) => {
            const [dayStr, monthStr] = args[0].split('.')
            const day = Number(dayStr)
            const month = Number(monthStr)

            if (isNaN(day) || isNaN(month)) {
                telegram.sendMessage(message.chat.id, `Päiväys ei ole numero`, {
                    disable_notification: true,
                    reply_to_message_id: message.message_id,
                })

                return
            }

            const query = { userid: message.from?.id }
            const update = { $set: { userid: message.from?.id, username: message.from?.username, day, month } }
            getCollection('birthdays')
                .updateOne(query, update, { upsert: true })
                .then(() => {
                    telegram.sendMessage(message.chat.id, `Syntymäpäivä asetettu ${day}.${month}.`, {
                        disable_notification: true,
                        reply_to_message_id: message.message_id,
                    })
                })
        },
    })

    commander.addInitializer((telegram) => {
        new CronJob('0 12 * * *', () => {
            const day = new Date().getDate()
            const month = new Date().getMonth() + 1 // In JS months start from 0

            getCollection<BirthdayDoc>('birthdays')
                .find({ day, month })
                .toArray((err, docs) => {
                    if (!process.env.TG_CHAT) throw Error('No Telegram chat id')

                    for (const bdd of docs) {
                        telegram.sendMessage(process.env.TG_CHAT, `/onnea@${bdd.username}`)
                    }
                })
        }).start()
    })
}
