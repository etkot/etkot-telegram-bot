import { Commander } from '.'
import { getCollection } from '../mongoUtil'

interface AuthDocument {
    _id: number
    is_bot: boolean
    first_name: string
    last_name: string
    username: string
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['auth', 'authenticate'],
        arguments: [],
        help: 'Lisää tietosi etkot botin kirjautumis listaan',

        func: async (args, message, telegram) => {
            const user = message.from

            if (!user) {
                telegram.sendMessage(message.chat.id, 'Et ole kirjautunut sisään >:(', { disable_notification: true })
                return
            }

            try {
                await getCollection<AuthDocument>('auth').updateOne(
                    { _id: user.id },
                    { $set: { ...user } },
                    { upsert: true }
                )
                telegram.sendMessage(message.chat.id, `Kirjautumis tiedot lisätty`, { disable_notification: true })
            } catch (error) {
                console.error(error)
                telegram.sendMessage(message.chat.id, `Lisäys epäonnistui :(`, { disable_notification: true })
            }
        },
    })
}
