import { Commander } from '.'
import oaiUtils from '../openAIUtils'

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
                .then((generatedAnswer) =>
                    telegram.sendMessage(message.chat.id, `${generatedAnswer || 'Ei vastausta'}`, {
                        disable_notification: true,
                        reply_to_message_id: message.message_id,
                    })
                )
                .catch((res) => {
                    console.error('Could not generate answer:', res.response.status, res.response.statusText)
                })
        },
    })
}
