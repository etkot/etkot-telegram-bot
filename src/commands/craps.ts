import { Commander } from '.'

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['craps', 'c'],
        arguments: [],
        help: 'Heittää kaksi noppaa',

        func: (args, message, telegram) => {
            telegram.sendDice(message.chat.id, { disable_notification: true }).then(({ dice }) => {
                let diceValue = dice?.value as number

                telegram.sendDice(message.chat.id, { disable_notification: true }).then(({ dice }) => {
                    diceValue += dice?.value as number

                    setTimeout(() => {
                        telegram.sendMessage(
                            message.chat.id,
                            diceValue === 2 ? '🐍 SNAKE 🐍 EYES 🐍' : `Sait numeron ${diceValue}`,
                            { disable_notification: true, reply_to_message_id: message.message_id }
                        )
                    }, 4000)
                })
            })
        },
    })
}
