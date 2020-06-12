const EventEmitter = require('events');

const UserManager = require('./userManager');
const User = require('./user');

const ChatManager = require('./chatManager');
const Chat = require('./chat');

const MessageManager = require('./messageManager');
const Message = require('./message');


/**
 * An update object sent by the Telegram servers
 * @typedef {Object} Update
 * @property {number} update_id - The update's unique identifier
 * @property {Message} [message] - New incoming message of any kind
 * @property {Message} [edited_message] - New version of a message that is known to the bot and was edited
 * @property {Message} [channel_post] - New incoming channel post of any kind
 * @property {Message} [edited_channel_post] - New version of a channel post that is known to the bot and was edited
 * @property {InlineQuery} [inline_query] - New incoming inline query
 * @property {ChosenInlineResult} [chosen_inline_result] - The result of an inline query that was chosen by a user and sent to their chat partner
 * @property {CallbackQuery} [callback_query] - New incoming callback query
 * @property {ShippingQuery} [shipping_query] - New incoming shipping query
 * @property {PreCheckoutQuery} [pre_checkout_query] - New incoming pre-checkout query
 * @property {Poll} [poll] - New poll state
 * @property {PollAnswer} [poll_answer] - A user changed their answer in a non-anonymous poll
 */


const createUrl = (method, parameters) => {
    let str = method + '?';

    for (let i in parameters) {
        if (parameters[i] === undefined) continue;

        let data = JSON.stringify(parameters[i]);

        str += encodeURIComponent(i);
        str += '=';
        str += encodeURIComponent(data);
        str += '&';
    }

    return str.substring(0, str.length - 1);
}


class Bot extends EventEmitter {
    /**
     * Bot Constructor
     * @constructor
     * @param {string} token - Telegram bot token
     */
    constructor(token) {
        super();

        /**
         * Token of this bot
         * @type {string}
         */
        this.token = token;
        
        /**
         * ID of the last update
         * @type {number}
         * @private
         */
        this._lastUpdateId = -1;

        /**
         * User data of the bot
         * @type {User}
         */
        this.user;

        /**
         * Chats the bot is in
         * @type {ChatManager}
         */
        this.chatManager;


        this.SendMethod('getMe').then((response) => {
            this.user = response;
        });
    }

    /**
     * Method for sending any Telegram method.
     * This should not be used. Use the dedicated methods instead.
     * @param {string} method - Telegram method to execute
     * @param {Object} parameters - Method parameters
     * @returns {Promise<Object>} Telegram response
     */
    SendMethod(method, parameters) {
        return new Promise((resolve, reject) => {
            try {
                https.get(`https://api.telegram.org/bot${this.token}/${createUrl(method, parameters)}`, res => {
                    res.on('data', d => {
                        let data = JSON.parse(d);
                        if (data.ok) {
                            resolve(data.result);
                        } else {
                            reject(`Telegram error (${data.error_code}): ${data.description} (method: ${method})`);
                        }
                    });
                }).on('error', e => {
                    reject(e);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    StartPolling() {
        this.SendMethod('getUpdates', { offset: this._lastUpdateId }).then(res => {
            /**
             * Telegram server updates response
             * @type {Update[]}
             */
            const response = res;

            if (response.length > 0) {
                this._lastUpdateId = response[response.length - 1].update_id + 1;

                for (const update of response) {
                    // All updates
                    this.emit('update', update);

                    // Message
                    if (update.message) {
                        const chat = this.chatManager.GetChat(update.message.chat);
                        const message = chat.messageManager.GetMessage(update.message);

                        this.emit('message', message);
                        chat.emit('message', message);
                    }

                    // Edited message
                    if (update.edited_message) {
                        const chat = this.chatManager.GetChat(update.message.chat);
                        const message = chat.messageManager.GetMessage(update.message);

                        this.emit('edited_message', message);
                        chat.emit('edited_message', message);
                    }

                    // Channel post
                    if (update.channel_post) {
                        const chat = this.chatManager.GetChat(update.message.chat);
                        const message = chat.messageManager.GetMessage(update.message);

                        this.emit('channel_post', message);
                        chat.emit('channel_post', message);
                    }

                    // Edited channel post
                    if (update.edited_channel_post) {
                        const chat = this.chatManager.GetChat(update.message.chat);
                        const message = chat.messageManager.GetMessage(update.message);

                        this.emit('edited_channel_post', message);
                        chat.emit('edited_channel_post', message);
                    }

                    /**
                     * TODO:
                     *   inline_query
                     *   chosen_inline_result
                     *   callback_query
                     *   shipping_query
                     *   pre_checkout_query
                     *   poll
                     *   poll_answer
                     */
                }
            }
            this.StartPolling();
        }).catch(err => {
            console.error(err);

            setTimeout(() => {
                console.log('Restaring polling...');
                this.StartPolling();
            }, 5000);
        });
    }
}

module.exports = Bot;
