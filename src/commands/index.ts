import fs from 'fs'
import path from 'path'
import { Telegram } from '../telegram'
import * as TG from '../types/telegram'

type Initializer = (telegram: Telegram) => void
type CommandFunction = (args: string[], message: TG.Message, telegram: Telegram) => void
type TriggerFunction = (message: TG.Message, telegram: Telegram) => void

interface Command {
    commands: string[]
    arguments: string[]
    allowReply?: boolean
    help: string
    func: CommandFunction
}
interface Trigger {
    ids: string[]
    func: TriggerFunction
}

export class Commander {
    initializers: Array<Initializer>
    commands: { [key: string]: Command }
    triggers: { [key: string]: Trigger }

    constructor() {
        this.initializers = []
        this.commands = {}
        this.triggers = {}
    }

    addInitializer(func: Initializer): void {
        this.initializers.push(func)
    }

    addCommand(data: Command): void {
        let i = 0
        for (const cmd of data.commands) {
            if (this.commands[cmd] !== undefined) {
                throw `Cannot create command "${cmd}": Already exists`
            }

            this.commands[cmd] = Object.assign({ master: i === 0 }, data)
            i++
        }
    }

    addTrigger(data: Trigger): void {
        for (const id of data.ids) {
            if (this.triggers[id] !== undefined) {
                throw `Cannot create trigger "${id}": Already exists`
            }

            this.triggers[id] = data
        }
    }

    onInitialize(telegram: Telegram): void {
        for (const init of this.initializers) {
            init(telegram)
        }
    }

    onCommand(cmd: string, args: string[], message: TG.Message, telegram: Telegram): boolean {
        if (this.commands[cmd] === undefined) {
            return false
        }

        const command = this.commands[cmd]

        const hasReply = command.allowReply && message.reply_to_message

        const shouldHave = command.arguments.filter((arg) => arg.charAt(0) === '<').length
        if (args.length < shouldHave && !hasReply) {
            this.commands['usage'].func([cmd], message, telegram)
            return false
        }

        command.func(args, message, telegram)
        return true
    }

    onTrigger(id: string, message: TG.Message, telegram: Telegram): boolean {
        if (this.triggers[id] === undefined) {
            return false
        }

        this.triggers[id].func(message, telegram)
        return true
    }
}

const readdir = (dir: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) reject(err)
            resolve(files)
        })
    })
}

export default (): Promise<Commander> => {
    return new Promise((resolve, reject) => {
        const commander = new Commander()

        // Load commands
        readdir(path.join(__dirname))
            .then((files) => {
                for (const file of files) {
                    if (file !== 'index.js') {
                        try {
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                            require(`./${file}`).default(commander)
                        } catch (err) {
                            reject(err)
                        }
                    }
                }

                resolve(commander)
            })
            .catch(reject)
    })
}
