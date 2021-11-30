import axios from 'axios'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import FormData from 'form-data'
import syncFs from 'fs'
import fs from 'fs/promises'
import { Commander } from '.'
import { Message, Response } from '../types/telegram'

dayjs.extend(isToday)

const base = `${__dirname}/../../images/joulukalenteri`
const imageLocation = `${base}/${dayjs().format('YYYY')}`
const lastPinnedId = `${base}/lastpinned.txt`
const fileFormatsToCheck = ['jpg', 'jpeg', 'png', 'gif']

const getLastPinned = async () => {
    try {
        const lastPinned = await fs.readFile(lastPinnedId, 'utf8')
        return lastPinned
    } catch (e) {
        return '0'
    }
}

const setLastPinned = async (id: string | number) => {
    await fs.writeFile(lastPinnedId, id.toString())
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['christmas', 'ch', 'luukku'],
        arguments: [],
        help: 'Avaa päivän joulukalenteriluukun',

        func: async (args, message, telegram) => {
            const today = dayjs()
            const christmas = dayjs().set('month', 11).set('date', 25)

            if (dayjs().get('month') !== 11) {
                telegram.sendMessage(message.chat.id, 'Ei nyt ole joulukuu!')
                return
            }

            if (today.isAfter(christmas)) {
                telegram.sendMessage(message.chat.id, 'Joulu meni jo :D', {
                    disable_notification: true,
                    parse_mode: 'html',
                })
                return
            }

            if (christmas.isToday()) {
                telegram.sendMessage(message.chat.id, 'Hyvää joulua!', {
                    disable_notification: true,
                    parse_mode: 'html',
                })
                return
            }

            const pre_res = await telegram.sendMessage(message.chat.id, 'Avataan luukkua!!')
            const message_id = pre_res.message_id

            try {
                const fileEnding = fileFormatsToCheck.filter((format) =>
                    syncFs.existsSync(`${imageLocation}/${1}.${format}`)
                )[0]

                if (!fileEnding) {
                    throw new Error('No image found')
                }

                const file = `${imageLocation}/${today.get('date')}.${fileEnding}`

                const form = new FormData()
                form.append('chat_id', message.chat.id.toString())
                form.append('caption', `Luukku ${today.get('date')}`)
                form.append('photo', syncFs.createReadStream(file), {
                    filename: `${today.get('date')}.png`,
                })
                form.append('disable_notification', 'true')

                const res = await axios.post<Response & { result: Message }>(`${telegram.getBotUrl()}sendPhoto`, form, {
                    headers: form.getHeaders(),
                })
                if (!res.data.ok) {
                    throw new Error(res.data.description)
                }

                const lastPinned = await getLastPinned()

                if (lastPinned !== today.get('date').toString()) {
                    telegram.pinChatMessage(message.chat.id, res.data.result.message_id)
                    await setLastPinned(today.get('date').toString())
                }
            } catch (error: any) {
                if (error.data) {
                    console.error(`Telegram error (${error.data.error_code}): ${error.data.description}`)
                } else if (error.response) {
                    console.error(error.response.data)
                    console.error(error.response.status)
                    console.error(error.response.headers)
                } else if (error.request) {
                    console.error(`Axios request not sent:`)
                    console.error(error.request)
                } else if (error.message) {
                    console.error(error.message)
                } else {
                    console.error(error)
                }
                telegram.sendMessage(message.chat.id, 'Luukkupuuttuutaionrikki pls hjäp T: Tontut :/')
            }

            telegram.deleteMessage(message.chat.id, message_id)
        },
    })
}
