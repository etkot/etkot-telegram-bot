import { AxiosError } from 'axios'
import { Commander } from '.'
import { Telegram } from '../telegram'
import * as TG from '../types/telegram'

const neppiUrl = process.env.LOMMI_NEPPI_URL || ''

const urlWithTime = (unixTime: number) => `${neppiUrl}/${unixTime}`

const SendNeppiImage = (message: TG.Message, telegram: Telegram) => {
    const unixTime = Math.round(new Date().getTime() / 1000)

    telegram
        .sendPhoto(message.chat.id, urlWithTime(unixTime), {
            disable_notification: true,
        })
        .catch(() => {
            console.log('Failed to send neppi-image')
        })
}

// Allow iterator to run until we reach the time limit
function* ticker(firstMessageId: number, duration: number) {
    const startTime = new Date().getTime()
    const endTime = startTime + duration * 1000

    while (new Date().getTime() < endTime) {
        yield new Date().getTime()
    }

    return 0
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

    commander.addCommand({
        commands: ['nep_live', 'neppi_live', 'kiltis_live'],
        arguments: [],
        help: 'Lähettää live kuvaa kiltahuoneelta 1 min ajan',

        func: async (args, message, telegram) => {
            const duration = 60
            let timestamp = new Date().getTime()

            // Send first image
            const firstImage = await telegram.sendPhoto(message.chat.id, urlWithTime(timestamp), {
                disable_notification: true,
            })

            const tick = ticker(firstImage.message_id, duration)
            while ((timestamp = tick.next().value)) {
                try {
                    await telegram.editMessageMedia(
                        {
                            type: 'photo',
                            media: urlWithTime(timestamp),
                            objectName: '',
                        },
                        {
                            chat_id: message.chat.id,
                            message_id: firstImage.message_id,
                        }
                    )
                } catch (error) {
                    const err = error as AxiosError
                    if (err.response?.status === 429) {
                        telegram.sendMessage(message.chat.id, 'Image editing rate limit lemme sleep for 20s')
                        await new Promise((resolve) => setTimeout(resolve, 20000)) // 20s
                    }
                }
            }
        },
    })
}
