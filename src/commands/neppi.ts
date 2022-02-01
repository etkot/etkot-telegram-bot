import { Commander } from '.'
import * as TG from '../types/telegram'
import { Telegram } from '../telegram'

const neppiUrl = process.env.LOMMI_NEPPI_URL || ''

const SendNeppiImage = (message: TG.Message, telegram: Telegram) => {
    const unixTime = Math.round(new Date().getTime() / 1000);
    const urlWithTime = `${ neppiUrl }/${ unixTime }`;

    telegram
        .sendPhoto(message.chat.id, urlWithTime, {
            disable_notification: true,
        })
        .catch(() => {
            console.log('Failed to send neppi-image')
        })
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['nep', 'neppi', 'kiltis'],
        arguments: [],
        help: 'Lähettää valokuvan kiltahuoneelta',

        func: (args, message, telegram) => {
            SendNeppiImage(message, telegram)
        },
    })
}

