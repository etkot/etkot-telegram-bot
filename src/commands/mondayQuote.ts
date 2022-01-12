import { AxiosError } from 'axios'
import { CronJob } from 'cron'
import { Commander } from '.'
import oaiUtils from '../openAIUtils'
import { Telegram } from '../telegram'

const sendMotivationalQuote = async (chat_id: string | number, telegram: Telegram, topic?: string): Promise<void> => {
    try {
        const generatedQuote = await oaiUtils.mondayQuote(topic)
        telegram.sendMessage(chat_id, generatedQuote || 'Ei motivaatiota tänään', {
            disable_notification: true,
        })
    } catch (error) {
        const err = error as AxiosError
        console.error('Could not generate answer:', err.response?.status, err.response?.statusText)
    }
}

export default (commander: Commander): void => {
    commander.addInitializer((telegram) => {
        new CronJob('00 7 * * 1', () => {
            if (!process.env.TG_CHAT) throw Error('No Telegram chat id')
            sendMotivationalQuote(process.env.TG_CHAT, telegram)
        }).start()
    })

    commander.addCommand({
        commands: ['motivation', 'moti'],
        arguments: ['[topic]'],
        help: 'Kertoo päivän motivational quoten',

        func: async (args, message, telegram) => {
            const topic = args.join(' ')
            sendMotivationalQuote(message.chat.id, telegram, topic)
        },
    })
}
