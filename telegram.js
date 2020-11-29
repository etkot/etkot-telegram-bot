const https = require('https')
const EventEmitter = require('events')
const Axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const createUrl = function (args, options) {
    let str = ''

    for (let i in args) {
        if (args[i] === undefined) continue

        str += encodeURIComponent(i)
        str += '='
        str += encodeURIComponent(args[i])
        str += '&'
    }

    if (options) {
        str += createUrl(options)
        str += '&'
    }

    return str.substring(0, str.length - 1)
}

class Telegram extends EventEmitter {
    /**
     * Constructor
     * @constructor
     * @param {string} token - Telegram bot token
     */
    constructor(token) {
        super()

        this.botUrl = `https://api.telegram.org/bot${token}/`
        this._lastMessageId = -1

        this.SendMethod('getMe').then((response) => {
            this.user = response
        })
    }

    /**
     * Method for sending any Telegram method.
     * This should not be used. Use the dedicated methods instead.
     * @param {string} method - Data string
     * @returns {Promise} Telegram response
     */
    SendMethod(method) {
        return new Promise((resolve, reject) => {
            try {
                https
                    .get(this.botUrl + method, (res) => {
                        res.on('data', (d) => {
                            let data = JSON.parse(d)
                            if (data.ok) {
                                resolve(data.result)
                            } else {
                                reject(`Telegram error (${data.error_code}): ${data.description} (method: ${method})`)
                            }
                        })
                    })
                    .on('error', (e) => {
                        reject(e)
                    })
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Gets bot information
     * @returns {Promise} Telegram response
     */
    GetMe() {
        return this.SendMethod('getMe')
    }

    /**
     * Send a message to a chat
     * @param {(number|string|Object)} chat_id - ID of the chat
     * @param {string} text - Text to be sent
     * @param {Object} [options] - Optional parameters
     * @param {string} [options.parse_mode] - Send Markdown or HTML
     * @param {boolean} [options.disable_web_page_preview] - Disables link previews for links in this message
     * @param {boolean} [options.disable_notification] - Sends the message silently
     * @param {number} [options.reply_to_message_id] - If the message is a reply, ID of the original message
     * @param {Object} [options.reply_markup] - Additional interface options
     * @returns {Promise} Telegram response
     */
    SendMessage(chat_id, text, options) {
        if (typeof chat_id === 'object' && chat_id.id) chat_id = chat_id.id
        return this.SendMethod(`sendMessage?${createUrl({ chat_id, text }, options)}`)
    }

    /**
     * Send a photo to a chat
     * @param {(number|string|Object)} chat_id - ID of the chat
     * @param {string} photo - URL of the photo
     * @param {string} caption - Text to be sent
     * @param {Object} [options] - Optional parameters
     * @param {string} [options.parse_mode] - Send Markdown or HTML
     * @param {boolean} [options.disable_web_page_preview] - Disables link previews for links in this message
     * @param {boolean} [options.disable_notification] - Sends the message silently
     * @param {number} [options.reply_to_message_id] - If the message is a reply, ID of the original message
     * @param {Object} [options.reply_markup] - Additional interface options
     * @returns {Promise} Telegram response
     */
    SendPhoto(chat_id, photo, caption, options) {
        if (typeof chat_id === 'object' && chat_id.id) chat_id = chat_id.id
        return this.SendMethod(`sendPhoto?${createUrl({ chat_id, photo, caption }, options)}`)
    }

    /**
     * Send a photo to a chat
     * @param {(number|string|Object)} chat_id - ID of the chat
     * @param {string} photo - Location of the photo
     * @param {string} caption - Text to be sent
     * @param {Object} [options] - Optional parameters
     * @param {string} [options.parse_mode] - Send Markdown or HTML
     * @param {boolean} [options.disable_web_page_preview] - Disables link previews for links in this message
     * @param {boolean} [options.disable_notification] - Sends the message silently
     * @param {number} [options.reply_to_message_id] - If the message is a reply, ID of the original message
     * @param {Object} [options.reply_markup] - Additional interface options
     * @returns {Promise} Telegram response
     */
    SendLocalPhoto(chat_id, photo, caption, options) {
        if (typeof chat_id === 'object' && chat_id.id) chat_id = chat_id.id
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
                resolve(res.response)
            } catch (error) {
                if (error.response) {
                    reject(`Telegram error (${error.response.data.error_code}): ${error.response.data.description}`)
                }
                reject(error)
            }
        })
    }

    /**
     * Send a dice to a chat
     * @param {(number|string|Object)} chat_id - ID of the chat
     * @param {Object} [options] - Optional parameters
     * @param {boolean} [options.disable_notification] - Sends the message silently
     * @param {number} [options.reply_to_message_id] - If the message is a reply, ID of the original message
     * @param {Object} [options.reply_markup] - Additional interface options
     * @returns {Promise} Telegram response
     */
    SendDice(chat_id, options) {
        if (typeof chat_id === 'object' && chat_id.id) chat_id = chat_id.id
        return this.SendMethod(`sendDice?${createUrl({ chat_id }, options)}`)
    }

    /**
     * Send a poll to a chat
     * @param {(number|string|Object)} chat_id - ID of the chat
     * @param {string} question - poll question (1-255 characters)
     * @param {string[]} anwsers - list of anwsers (2-10 strings 1-100 characters each)
     * @param {Object} [options] - Optional parameters
     * @param {boolean} [options.is_anonymous] - True, if the poll needs to be anonymous, defaults to True
     * @param {string} [options.type] - Poll type, “quiz” or “regular”, defaults to “regular”
     * @param {boolean} [options.allows_multiple_answers] - True, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to False
     * @param {number} [options.correct_option_id] - 0-based identifier of the correct answer option, required for polls in quiz mode
     * @param {string} [options.explanation] - Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing
     * @param {string} [options.explanation_parse_mode] - Mode for parsing entities in the explanation
     * @param {number} [options.open_period] - Amount of time in seconds the poll will be active after creation, 5-600. Can't be used together with close_date.
     * @param {number} [options.close_date] - Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can't be used together with open_period.
     * @param {boolean} [options.is_closed] - Pass True, if the poll needs to be immediately closed. This can be useful for poll preview.
     * @param {boolean} [options.disable_notification] - Sends the message silently. Users will receive a notification with no sound.
     * @param {number} [options.reply_to_message_id] - If the message is a reply, ID of the original message
     * @param {Object} [options.reply_markup] - Additional interface options
     * @returns {Promise} Telegram response
     */
    SendPoll(chat_id, question, anwsers, options) {
        if (typeof chat_id === 'object' && chat_id.id) chat_id = chat_id.id
        return this.SendMethod(
            `sendPoll?${createUrl({ chat_id, question, options: JSON.stringify(anwsers) }, options)}`
        )
    }

    /**
     * Leaves a chat
     * @param {(number|string|Object)} chat_id - ID of the chat
     * @returns {Promise} Telegram response
     */
    LeaveChat(chat_id) {
        if (typeof chat_id === 'object' && chat_id.id) chat_id = chat_id.id
        return this.SendMethod(`leaveChat?${createUrl({ chat_id })}`)
    }

    /**
     * Leaves a chat
     * @param {(number|string|Object)} chat_id - ID of the chat
     * @param {string} message_id - Identifier of the message to delete
     * @returns {Promise} Telegram response
     */
    DeleteMessage(chat_id, message_id) {
        if (typeof chat_id === 'object' && chat_id.id) chat_id = chat_id.id
        return this.SendMethod(`deleteMessage?${createUrl({ chat_id, message_id })}`)
    }

    /**
     * Starts the polling process
     */
    StartPolling() {
        this.SendMethod(`getUpdates?offset=${this._lastMessageId}`)
            .then((response) => {
                if (response.length > 0) {
                    this._lastMessageId = response[response.length - 1].update_id + 1

                    for (let update of response) {
                        // All updates
                        this.emit('update', update)

                        let message = update.message
                        if (message) {
                            // Message
                            if (message.text) {
                                this.emit('message', message)
                            }

                            // Sticker
                            if (message.sticker) {
                                this.emit('sticker', message)
                            }

                            // New Chat Members
                            if (message.new_chat_members) {
                                for (let member of message.new_chat_members) {
                                    if (member.id === this.user.id) {
                                        this.emit('newChatJoined', message)
                                    } else {
                                        this.emit('newChatMember', message)
                                    }
                                }
                            }

                            // Left Chat Member
                            if (message.left_chat_member) {
                                if (message.left_chat_member.id === this.user.id) {
                                    this.emit('leftChat', message)
                                } else {
                                    this.emit('leftChatMember', message)
                                }
                            }
                        }
                    }
                }
                this.StartPolling()
            })
            .catch((err) => {
                console.error(err)

                setTimeout(() => {
                    console.log('Restaring polling...')
                    this.StartPolling()
                }, 5000)
            })
    }
}

module.exports = Telegram
