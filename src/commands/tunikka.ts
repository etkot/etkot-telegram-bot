import axios from 'axios'
import { Commander } from '.'
import { getCollection } from '../mongoUtil'

interface TunikkaDocument {
    msg: number[]
    res: any
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['tunikka'],
        arguments: [],
        help: 'Lisää tunikka löydön Duon tai Wäinölöiden edessä',

        func: async (args, message, telegram) => {
            const res = await axios.get<any>('http://data.itsfactory.fi/journeys/api/1/vehicle-activity')

            telegram
                .sendMessage(message.chat.id, 'Tunikka löytö lisätty', { disable_notification: true })
                .then((value) => {
                    getCollection<TunikkaDocument>('tunikka').insertOne({
                        msg: [message.message_id, value.message_id],
                        res: res.data,
                    })
                })
        },
    })

    commander.addCommand({
        commands: ['eiku'],
        arguments: [],
        help: 'Poistaa tunikka löydön',

        func: async (args, message, telegram) => {
            if (!message.reply_to_message) {
                return
            }

            getCollection<TunikkaDocument>('tunikka')
                .deleteOne({ msg: message.reply_to_message.message_id })
                .then((value) => {
                    if (value.deletedCount !== undefined && value.deletedCount > 0)
                        telegram.sendMessage(message.chat.id, 'Tunikka löytö poistettu', { disable_notification: true })
                    else
                        telegram.sendMessage(message.chat.id, 'Tunikka löytöä ei löytynyt', {
                            disable_notification: true,
                        })
                })
        },
    })
}
