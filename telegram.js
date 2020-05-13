const https = require('https');
const EventEmitter = require('events');

const createUrl = function(args) {
    let str = '';

    for (let i in args) {
        if (args[i] === undefined) continue;

        if (i === 'options') {
            str += createUrl(args[i]);
            str += '&';
        } else {
            str += encodeURIComponent(i);
            str += '=';
            str += encodeURIComponent(args[i]);
            str += '&';
        }
    }

    return str.substring(0, str.length - 1);
}

class Telegram extends EventEmitter {
    /**
     * Constructor
     * @constructor
     * @param {string} token - Telegram bot token
     */ 
    constructor(token) {
        super();

        this.botUrl = `https://api.telegram.org/bot${token}/`;
        this._lastMessageId = -1;

        this.SendMethod('getMe').then((response) => {
            this.user = response;
        });
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
                https.get(this.botUrl + method, (res) => {        
                    res.on('data', (d) => {
                        let data = JSON.parse(d);
                        if (data.ok) {
                            resolve(data.result);
                        } else {
                            reject(`Telegram error (${data.error_code}): ${data.description}`);
                        }
                    });
                }).on('error', (e) => {
                    reject(e);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    

    /**
     * Gets bot information
     * @returns {Promise} Telegram response
     */ 
    GetMe() {
        return this.SendMethod('getMe');
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
        if (typeof chat_id === 'object' && chat_id.id) chat_id = chat_id.id;
        return this.SendMethod(`sendMessage?${createUrl({ chat_id, text, options })}`);
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
        if (typeof chat_id === 'object' && chat_id.id) chat_id = chat_id.id;
        return this.SendMethod(`sendDice?${createUrl({ chat_id, options })}`);
    }

    /**
     * Leaves a chat
     * @param {(number|string|Object)} chat_id - ID of the chat
     * @returns {Promise} Telegram response
     */
    LeaveChat(chat_id) {
        if (typeof chat_id === 'object' && chat_id.id) chat_id = chat_id.id;
        return this.SendMethod(`leaveChat?${createUrl({ chat_id })}`);
    }



    /**
     * Starts the polling process
     */
    StartPolling() {
        this.SendMethod(`getUpdates?offset=${this._lastMessageId}`).then((response) => {
            if (response.length > 0) {
                this._lastMessageId = response[response.length - 1].update_id + 1;

                for (let update of response) {
                    // All updates
                    this.emit('update', update);
                    
                    let message = update.message;
                    if (message) {
                        // Message
                        if (message.text) {
                            this.emit('message', message);
                        }

                        // Sticker
                        if (message.sticker) {
                            this.emit('sticker', message);
                        }
    
                        // New Chat Members
                        if (message.new_chat_members) {
                            for (let member of message.new_chat_members) {
                                if (member.id === this.user.id) {
                                    this.emit('newChatJoined', message);
                                } else {
                                    this.emit('newChatMember', message);
                                }
                            }
                        }
    
                        // Left Chat Member
                        if (message.left_chat_member) {
                            if (message.left_chat_member.id === this.user.id) {
                                this.emit('leftChat', message);
                            } else {
                                this.emit('leftChatMember', message);
                            }
                        }
                    }
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

module.exports = Telegram;
