import { Commander } from '.'
import { getCollection } from '../mongoUtil'

export interface UsageDocument {
    id: number
    username: string
    tokens: number
}

export const addUsage = (id: number, username: string, tokens: number): void => {
    getCollection<UsageDocument>('ai-usage').updateOne(
        { id },
        { $inc: { tokens }, $set: { username } },
        { upsert: true }
    )
}

const ilari = 932360502

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['ai_usage', 'us', 'as'],
        arguments: [],
        help: 'Katso kuka polttaa ilarin rahoja :D',

        func: async (args, message, telegram) => {
            // $0.0600 / 1K tokens
            const tokenPrice = 0.06 / 1000

            const usage = await getCollection<UsageDocument>('ai-usage').find({}).toArray()

            const sorted = Array.from(usage.entries()).sort(([, a], [, b]) => b.tokens - a.tokens)
            let msg = '<b>AI Usage:</b>\n'
            for (const [, obj] of sorted) {
                msg += `  ${obj.username}: ${Math.round(obj.tokens * tokenPrice * 100) / 100}$\n`
            }
            telegram.sendMessage(message.chat.id, msg, { disable_notification: true, parse_mode: 'html' })
        },
    })

    commander.addCommand({
        commands: ['ai_clear', 'clear'],
        arguments: ['<username>'],
        help: 'Poista käyttäjän tokenit',
        func: async (args, message, telegram) => {
            const username = args[0]
            if (!username) {
                telegram.sendMessage(message.chat.id, 'Käyttäjänimi puuttuu', { disable_notification: true })
                return
            }

            const commandIssuer = message.from?.id || 0
            if (commandIssuer !== ilari) {
                telegram.sendMessage(message.chat.id, 'Et oo Ilari :(', { disable_notification: true })
                return
            }

            const usage = await getCollection<UsageDocument>('ai-usage').find({ username }).toArray()
            if (usage.length == 0) {
                telegram.sendMessage(message.chat.id, 'Käyttäjää ei löytynyt', { disable_notification: true })
                return
            }
            const usageDoc = usage[0]
            await getCollection<UsageDocument>('ai-usage').updateOne({ id: usageDoc.id }, { $set: { tokens: 0 } })
            telegram.sendMessage(message.chat.id, 'Tokenit poistettu', { disable_notification: true })
        },
    })
}
