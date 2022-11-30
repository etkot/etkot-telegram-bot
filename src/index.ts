import { config } from 'dotenv'
import commands, { Commander } from './commands'
import { connectToServer } from './mongoUtil'
import { Telegram, TGEvent } from './telegram'
config()

if (process.env.DB_NAME === undefined) throw Error('No DB name in .env')
connectToServer(process.env.DB_NAME)

const telegram = new Telegram(process.env.TG_TOKEN || '')

let commander: Commander
commands()
    .then((cmdr) => {
        commander = cmdr
        console.log('Commands loaded')

        commander.onInitialize(telegram)

        telegram.StartPolling()
    })
    .catch((err) => {
        console.error('Could not initialize:', err)
        process.exit(1)
    })

telegram.on(TGEvent.update, (update) => {
    if (update.callback_query) {
        const args = update.callback_query.data?.split(' ') || []
        const cmd = args.shift() || ''

        commander.onCallbackQuery(cmd, args, update.callback_query, telegram)
    }
})

telegram.on(TGEvent.message, (message) => {
    if (message.chat.id != Number(process.env.TG_CHAT)) {
        return
    }

    if (message?.text?.charAt(0) == '/') {
        const args = message.text.substr(1).split(' ')
        const cmd = args.shift()?.split('@')[0] as string

        commander.onCommand(cmd, args, message, telegram)
    }
})

telegram.on(TGEvent.sticker, (message) => {
    if (message.chat.id != Number(process.env.TG_CHAT)) {
        return
    }

    commander.onTrigger(message.sticker?.file_unique_id as string, message, telegram)
})

telegram.on(TGEvent.JoinChat, (message) => {
    if (message.chat.id != Number(process.env.TG_CHAT)) {
        telegram.sendMessage(message.chat.id, 'Paska ryhmä')
        telegram.sendMessage(
            process.env.TG_CHAT as string,
            `@${message.from?.username} lisäsi minut ryhmään "${message.chat.title}"`
        )
        setTimeout(() => {
            telegram.leaveChat(message.chat.id)
        }, 100)
    }
})
