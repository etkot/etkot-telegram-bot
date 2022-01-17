import { Commander } from '.'

export default (commander: Commander): void => {
    const createFoodPoll = (commandNames: string[], commandHelp: string, pollPrompt: string, pollOptions: string[]) => {
        commander.addCommand({
            commands: commandNames,
            arguments: [],
            help: commandHelp,

            func: (_args, message, telegram) => {
                telegram.sendPoll(message.chat.id, pollPrompt, pollOptions, {
                    disable_notification: true,
                    is_anonymous: false,
                    allows_multiple_answers: true,
                })
            },
        })
    }

    createFoodPoll(['fondue', 'foodpoll', 'fp'], 'Luo pollin ruokapaikan valitsemiselle', 'Fondue?', [
        'Reaktori',
        'Newton',
        'Hertsi',
        'Såås',
    ])

    createFoodPoll(
        ['lounashervanta', 'bh', 'baahervanta', 'lounas'],
        'Pollaa Hervannan lounasravintolat',
        'Bääbää nams?',
        ['Speakeasy', 'Il Posto', 'Subway', 'Zarillo', 'Fire Wok', 'Kotipizza', 'C Sushi']
    )

    createFoodPoll(['lounaskeskusta', 'bk', 'baakeskusta'], 'Pollaa keskustan lounasravintolat', 'Bääbää nams?', [
        'Burger',
        'Pizza',
        'Sushi',
        'Kiinalainen',
        'Ramen',
        'Salaatti',
        'Siivet',
        'Perussuomalainen',
    ])
}
