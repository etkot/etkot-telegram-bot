import { Commander } from '.'
import oaiUtils from '../openAIUtils'
import { clearCache } from '../utils/messageCache'
import { addUsage } from './ai-usage'

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['answer', 'ans'],
        arguments: ['[question]'],
        allowReply: true,
        help: 'Vastaa kysymykseen tai kysymyksenkaltaiseen',

        func: (args, message, telegram) => {
            let question = args.join(' ')
            let reply = undefined

            if (message.reply_to_message) {
                reply = message.reply_to_message.message_id
                question = message.reply_to_message.text || ''
            }

            if (!question) {
                telegram.sendMessage(message.chat.id, 'Käyttö: /answer [question] tai replyllä kysymykseen', {
                    reply_to_message_id: reply,
                })
                return
            }

            oaiUtils
                .answer(question)
                .then(([generatedAnswer, tokens]) => {
                    addUsage(message.from?.id || 0, message.from?.username || '', tokens)
                    telegram.sendMessage(message.chat.id, `${generatedAnswer || 'Ei vastausta'}`, {
                        disable_notification: true,
                        reply_to_message_id: message.message_id,
                    })
                })
                .catch((res) => {
                    console.error('Could not generate answer:', res.response.status, res.response.statusText)
                })
        },
    })

    commander.addCommand({
        commands: ['clear_cache', 'cc'],
        arguments: [],
        allowReply: true,
        help: 'Tyhjentää message cachen, joka syötetään AI:lle',

        func: (_, message, telegram) => {
            clearCache()
            telegram.sendMessage(message.chat.id, 'Cache tyhjennetty', {
                reply_to_message_id: message.message_id,
            })
        },
    })
}
