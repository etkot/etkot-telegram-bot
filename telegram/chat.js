const EventEmitter = require('events');

const MessageManager = require('./messageManager');


class Chat extends EventEmitter {
    constructor(chatData) {
        super();

        /**
         * Unique identifier for this chat
         * @type {number}
         */
        this.id = chatData.id;

        /**
         * Type of chat, can be either "private", "group", "supergroup" or "channel"
         * @type {string}
         */
        this.type = chatData.type;

        /**
         * Title, for supergroups, channels and group chats
         * @type {string}
         */
        this.title = chatData.title;

        /**
         * Username, for private chats, supergroups and channels if available
         * @type {string}
         */
        this.username = chatData.username;

        /**
         * First name of the other party in a private chat
         * @type {string}
         */
        this.first_name = chatData.first_name;

        /**
         * Last name of the other party in a private chat
         * @type {string}
         */
        this.last_name = chatData.last_name;

        /**
         * Chat photo. Returned only in getChat.
         * @type {ChatPhoto}
         */
        this.photo = chatData.photo;

        /**
         * Description, for groups, supergroups and channel chats. Returned only in getChat.
         * @type {string}
         */
        this.description = chatData.property;

        /**
         * Chat invite link, for groups, supergroups and channel chats. Returned only in getChat.
         * @type {string}
         */
        this.invite_link = chatData.invite_link;

        /**
         * Pinned message, for groups, supergroups and channels. Returned only in getChat.
         * @type {Message}
         */
        this.pinned_message = chatData.pinned_message;

        /**
         * Default chat member permissions, for groups and supergroups. Returned only in getChat.
         * @type {ChatPermissions}
         */
        this.permissions = chatData.permissions;

        /**
         * For supergroups, the minimum allowed delay between consecutive messages sent by each unpriviledged user. Returned only in getChat.
         * @type {number}
         */
        this.slow_mode_delay = chatData.slow_mode_delay;

        /**
         * For supergroups, name of group sticker set. Returned only in getChat.
         * @type {string}
         */
        this.sticker_set_name = chatData.sticker_set_name;

        /**
         * True, if the bot can change the group sticker set. Returned only in getChat.
         * @type {boolean}
         */
        this.can_set_sticker_set = chatData.can_set_sticker_set;


        /**
         * Messages
         * @type {MessageManager}
         */
        this.messageManager = new MessageManager();
    }
}

module.exports = Chat;
