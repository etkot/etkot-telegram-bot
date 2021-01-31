import { Commander } from '.'

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['help', 'h'],
        arguments: ['[command]'],
        help: 'Kertoo miten komentoa käytetään',

        func: async (args, message, telegram) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const commands = (await require('./index')()).commands
            let msg = ''

            if (args.length > 0) {
                if (commands[args[0]]) {
                    msg = `${commands[args[0]].help}\nKäyttö: ${commands[args[0]].usage}`
                } else {
                    msg = `Komentoa ${args[0]} ei löydy\nKirjoita /help saadaksesi listan komennoista`
                }
            } else {
                for (const cmd in commands) {
                    if (commands[cmd].master && commands[cmd].help) {
                        msg += `/${cmd} - ${commands[cmd].help}\n`
                    }
                }
            }

            telegram.sendMessage(message.chat.id, msg, { disable_notification: true })
        },
    })

    commander.addCommand({
        commands: ['usage', 'u'],
        arguments: ['<command>'],
        help: 'Kertoo miten komentoa käytetään',

        func: async (args, message, telegram) => {
            let msg

            if (args.length === 0) {
                msg = `Käyttö: /usage <command>`
            } else {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const command = ((await require('./index')()) as Commander).commands[args[0]]
                msg = `Käyttö: /${command.commands[0]} ${command.arguments.join(' ')}`
            }

            telegram.sendMessage(message.chat.id, msg, { disable_notification: true })
        },
    })
}
