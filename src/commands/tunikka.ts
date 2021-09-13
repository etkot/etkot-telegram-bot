import axios from 'axios'
import { Commander } from '.'
import { getCollection } from '../mongoUtil'
import { Telegram } from '../telegram'
import { Message } from '../types/telegram'

interface TunikkaDocument {
    msg: number[]
    res: any
}

let lastTunikka: any

const getTunikka = async (allowLast: boolean) => {
    const res = await axios.get<any>('http://data.itsfactory.fi/journeys/api/1/vehicle-activity')

    let v = res.data.body.find((v: any) => v.monitoredVehicleJourney.vehicleRef === '56920_5')

    if (!v) {
        if (allowLast && lastTunikka) {
            v = lastTunikka
        } else {
            throw new Error('Tunikka not found')
        }
    }

    const loc = v.monitoredVehicleJourney.vehicleLocation
    const bearing = v.monitoredVehicleJourney.bearing

    lastTunikka = v

    return {
        loc,
        bearing,
    }
}

let liveLocationMessage: Message | undefined
let lastLiveLocation: { latitude: number, longitude: number };

export default (commander: Commander): void => {
    commander.addInitializer((telegram) => {
        setInterval(async () => {
            if (liveLocationMessage) {
                try {
                    const tunikka = await getTunikka(true)

                    if (tunikka.loc.latitude === lastLiveLocation.latitude &&
                        tunikka.loc.longitude === lastLiveLocation.longitude) {
                        return;
                    }

                    lastLiveLocation = tunikka.loc;

                    telegram
                        .editMessageLiveLocation(tunikka.loc.latitude, tunikka.loc.longitude, {
                            chat_id: liveLocationMessage.chat.id,
                            message_id: liveLocationMessage.message_id,
                            heading: tunikka.bearing,
                        })
                        .catch((err) => {
                            console.error(err)
                            liveLocationMessage = undefined
                        })
                } catch (error) {
                    return
                }
            }
        }, 5000)
    })

    commander.addCommand({
        commands: ['tunikka'],
        arguments: [],
        help: 'Lähettää tunikan sijainnin',

        func: async (args, message, telegram) => {
            try {
                const tunikka = await getTunikka(false)

                lastLiveLocation = tunikka.loc

                if (liveLocationMessage)
                    telegram.stopMessageLiveLocation({
                        chat_id: liveLocationMessage.chat.id,
                        message_id: liveLocationMessage.message_id,
                    })

                const msg = telegram
                    .sendLocation(message.chat.id, tunikka.loc.latitude, tunikka.loc.longitude, {
                        heading: tunikka.bearing,
                        live_period: 86400,
                        disable_notification: true,
                    })
                    .then((msg) => {
                        liveLocationMessage = msg
                    })
            } catch (error) {
                telegram.sendMessage(message.chat.id, '404 Tunikka not found', { disable_notification: true })
            }
        },
    })

    /*
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
    */
}
