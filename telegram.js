const https = require('https');
const EventEmitter = require('events');

class Telegram extends EventEmitter {
    constructor(token) {
        super();

        this.botUrl = `https://api.telegram.org/bot${token}/`;
        this._lastMessageId = -1;

        this.SendMethod('getMe').then((response) => {
            this.user = response;
        });
    }



    SendMethod(method) {
        return new Promise((resolve, reject) => {
            https.get(this.botUrl + method, (res) => {        
                res.on('data', (d) => {
                    let data = JSON.parse(d);
                    if (data.ok) {
                        resolve(data.result);
                    } else {
                        console.error(`Telegram error (${data.error_code}): ${data.description}`);
                    }
                });
            }).on('error', (e) => {
                reject(e);
            });
        });
    }



    GetMe() {
        return this.SendMethod('getMe');
    }

    SendMessage(chat, message, disable_notification = false) {
        if (typeof chat === 'object' && chat.id) chat = chat.id;
        return this.SendMethod(`sendMessage?chat_id=${encodeURIComponent(chat)}&text=${encodeURIComponent(message)}&disable_notification=${encodeURIComponent(disable_notification)}`);
    }

    SendDice(chat, disable_notification = false) {
        if (typeof chat === 'object' && chat.id) chat = chat.id;
        return this.SendMethod(`sendDice?chat_id=${encodeURIComponent(chat)}&disable_notification=${encodeURIComponent(disable_notification)}`);
    }
    
    LeaveChat(chat) {
        if (typeof chat === 'object' && chat.id) chat = chat.id;
        return this.SendMethod(`leaveChat?chat_id=${encodeURIComponent(chat)}`);
    }



    StartPolling() {
        this.SendMethod(`getUpdates?offset=${this._lastMessageId}`).then((response) => {
            if (response.length > 0) {
                this._lastMessageId = response[response.length - 1].update_id + 1;

                for (let update of response) {
                    let message = update.message;

                    // All updates
                    this.emit('update', message);

                    // Message
                    if (message.text) {
                        this.emit('message', message);
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
            this.StartPolling();
        });
    }
}

module.exports = Telegram;
