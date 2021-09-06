import axios from 'axios'
import { Commander } from '.'
import { getCollection } from '../mongoUtil'

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['tunikka'],
        arguments: [],
        help: 'Lisää tunikka löydön Duon tai Wäinölöiden edessä',

        func: async (args, message, telegram) => {
            const res = await axios.get<any>('http://data.itsfactory.fi/journeys/api/1/vehicle-activity')

            getCollection<{ res: any }>('tunikka')
                .insertOne({ res: res.data })
                .then(() => {
                    telegram.sendMessage(message.chat.id, 'Tunikka löytö lisätty', { disable_notification: true })
                })
        },
    })
}
