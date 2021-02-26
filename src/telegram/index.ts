import { EventEmitter } from 'events'
import * as TG from '../types/telegram'
import { TelegramMethods } from './methods'

export enum TGEvent {
    update = 'update',
    message = 'message',
    sticker = 'sticker',
    JoinChat = 'JoinChat',
    JoinChatMember = 'JoinChatMember',
    leftChat = 'leftChat',
    leftChatMember = 'leftChatMember',
}
type TGUpdateEvent = TGEvent.update
type TGMessageEvent =
    | TGEvent.message
    | TGEvent.sticker
    | TGEvent.JoinChat
    | TGEvent.JoinChatMember
    | TGEvent.leftChat
    | TGEvent.leftChatMember
export interface Telegram extends TelegramMethods, EventEmitter {
    on(event: TGUpdateEvent, listener: (update: TG.Update) => void): this
    on(event: TGMessageEvent, listener: (message: TG.Message) => void): this
}

export class Telegram extends TelegramMethods {
    private _botUrl: string
    private _lastMessageId: number
    private _user: TG.User | null
    private _polling: boolean

    /**
     * Constructor
     * @constructor
     * @param {string} token - Telegram bot token
     */
    constructor(token: string) {
        super()

        this._botUrl = `https://api.telegram.org/bot${token}/`
        this._lastMessageId = -1
        this._user = null
        this._polling = false

        this.getMe().then((user) => {
            this._user = user
        })
    }

    getBotUrl(): string {
        return this._botUrl
    }

    /** Use this method to send local photos. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    /*sendLocalPhoto(chat_id: number|string, photo: string, optional?: { caption?: string, parse_mode?: string, caption_entities?: Array<TG.MessageEntity>, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }) {
        return new Promise(async (resolve, reject) => {
            try {
                const form = new FormData()
                form.append('chat_id', chat_id)
                form.append('caption', caption)
                form.append('photo', fs.createReadStream(`${__dirname}/${photo}`), {
                    filename: photo,
                })

                if (options) {
                    for (const key in options) {
                        if (options.hasOwnProperty(key)) {
                            form.append(key, options[key].toString())
                        }
                    }
                }

                const res = await Axios.post(`${this.botUrl}sendPhoto`, form, {
                    headers: form.getHeaders(),
                })
                resolve(res.data)
            } catch (error) {
                if (error.data) {
                    reject(`Telegram error (${error.data.error_code}): ${error.data.description}`)
                }
                reject(error)
            }
        })
    }*/

    /**
     * Starts the polling process
     */
    StartPolling(): void {
        if (this._polling) return

        this._polling = true

        let restarted = false
        const Restart = () => {
            if (restarted) return

            restarted = true
            clearTimeout(timeout)
            this._polling = false
            this.StartPolling()
        }

        const timeout = setTimeout(() => {
            console.log("New getUpdates wasn't sent in 10 seconds!")
            Restart()
        }, 10 * 1000)

        this.getUpdates({ offset: this._lastMessageId })
            .then((response) => {
                if (response.length > 0) {
                    this._lastMessageId = response[response.length - 1].update_id + 1

                    for (const update of response) {
                        this._ProcessUpdate(update)
                    }
                }
                Restart()
            })
            .catch((err) => {
                console.error(err)

                setTimeout(() => {
                    console.log('Restaring polling...')
                    Restart()
                }, 5000)
            })
    }

    _ProcessUpdate(update: TG.Update): void {
        // All updates
        this.emit(TGEvent.update, update)

        const message = update.message
        if (message) {
            // Message
            if (message.text) {
                this.emit(TGEvent.message, message)
            }

            // Sticker
            if (message.sticker) {
                this.emit(TGEvent.sticker, message)
            }

            // New Chat Members
            if (message.new_chat_members) {
                for (const member of message.new_chat_members) {
                    if (member.id === this._user?.id) {
                        this.emit(TGEvent.JoinChat, message)
                    } else {
                        this.emit(TGEvent.JoinChatMember, message)
                    }
                }
            }

            // Left Chat Member
            if (message.left_chat_member) {
                if (message.left_chat_member.id === this._user?.id) {
                    this.emit(TGEvent.leftChat, message)
                } else {
                    this.emit(TGEvent.leftChatMember, message)
                }
            }
        }
    }
}

// Hacky solution to extend from both TelegramMethods and EventEmitter
Object.assign(Telegram.prototype, EventEmitter.prototype)
