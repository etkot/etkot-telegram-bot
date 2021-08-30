import { Commander } from '.'

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['contribute'],
        arguments: [],
        help: 'Lähettää contribute viestin',

        func: async (args, message, telegram) => {
            telegram.sendMessage(
                message.chat.id,
                'You can contribute to this project at https://github.com/etkot/etkot-telegram-bot',
                {
                    disable_notification: true,
                    reply_to_message_id: message.reply_to_message?.message_id,
                    disable_web_page_preview: true,
                }
            )
        },
    })
}
