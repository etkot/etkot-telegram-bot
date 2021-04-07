import axios from 'axios'
import { Commander } from '.'

const addr = "https://lommi.xyz/api/parveke"

interface TempData {
    temperature: number
    feels_like: number
}

const getTempData = async () => {
    return axios
        .get(addr, { timeout: 5000 })
        .then((res) => res.data.data as TempData)
        .catch(() => console.error('Temperature fetch timed out'))
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['temp', 't', 'lomminparveke'],
        arguments: [],
        help: 'Antaan Lommin parvekkeen lämpötilan',

        func: async (args, message, telegram) => {
            const { temperature: temp, feels_like: feels } = (await getTempData()) || {}

            if (temp === undefined || feels === undefined) {
                telegram.sendMessage(message.chat.id, 'Lämpötilan lukeminen ei onnistunut :(', {
                    disable_notification: true,
                    parse_mode: 'html',
                })
            } else {
                telegram.sendMessage(
                    message.chat.id,
                    `<b>Lämpötila: </b> ${Math.round(temp * 10) / 10}°C \n<b>Tuntuu kuin: </b> ${
                        Math.round(feels * 10) / 10
                    }°C`,
                    { disable_notification: true, parse_mode: 'html' }
                )
            }
        },
    })
}
