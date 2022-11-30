import { Commander } from '.'
import { getCollection } from '../mongoUtil'
import { addCredit, CreditDocument, removeCredit } from './credit'

const slotWinValues = [1, 22, 43, 64]

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['gamble'],
        arguments: [],
        help: 'Uhkapelaa socialcreditillä',

        func: async (args, message, telegram) => {
            let userSc = 0
            const username = message.from?.username || ''
            const id = message.from?.id || 0

            const docs = await getCollection<CreditDocument>('id_credit').find({ id }).toArray()

            for (const doc of docs) {
                userSc += doc.plus_credits?.length || 0
                userSc -= doc.minus_credits?.length || 0
            }

            if (userSc < 1) {
                telegram.sendMessage(
                    message.chat.id,
                    'You can contribute to this project at https://github.com/etkot/etkot-telegram-bot',
                    {
                        disable_notification: true,
                        reply_to_message_id: message.message_id,
                        disable_web_page_preview: true,
                    }
                )
                return
            }

            const { dice } = await telegram.sendDice(message.chat.id, { disable_notification: true, emoji: '🎰' })
            const slotValue = dice?.value as number
            let messageText: string

            if (slotWinValues.includes(slotValue)) {
                messageText = `Voitit pelissä 200 socialcredittiä!`
                Array.from({ length: 10 }, () =>
                    addCredit('EtkotBot', { id, username }, message.message_id, message.date)
                )
            } else {
                messageText = `Hävisit juuri 20 socialcredittiä!`
                removeCredit('EtkotBot', { id, username }, message.message_id, message.date)
            }

            setTimeout(() => {
                telegram.sendMessage(message.chat.id, messageText, {
                    disable_notification: true,
                    reply_to_message_id: message.message_id,
                })
            }, 2000)
        },
    })
}
