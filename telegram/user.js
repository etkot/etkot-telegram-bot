const EventEmitter = require('events');


class User extends EventEmitter {
    constructor(userData) {
        super();

        /**
         * Unique identifier for this user or bot
         * @type {number}
         */
        this.id = userData.id;

        /**
         * True, if this user is a bot
         * @type {boolean}
         */
        this.is_bot = userData.is_bot;

        /**
         * User's or bot's first name
         * @type {string}
         */
        this.first_name = userData.first_name;

        /**
         * Optional. User's or bot's last name
         * @type {string}
         */
        this.last_name = userData.last_name;

        /**
         * Optional. User's or bot's username
         * @type {string}
         */
        this.username = userData.username;

        /**
         * Optional. IETF language tag of the user's language
         * @type {string}
         */
        this.language_code = userData.language_code;

        /**
         * Optional. True, if the bot can be invited to groups. Returned only in getMe.
         * @type {boolean}
         */
        this.can_join_groups = userData.can_join_groups;

        /**
         * Optional. True, if privacy mode is disabled for the bot. Returned only in getMe.
         * @type {boolean}
         */
        this.can_read_all_group_messages = userData.can_read_all_group_messages;

        /**
         * Optional. True, if the bot supports inline queries. Returned only in getMe.
         * @type {boolean}
         */
        this.supports_inline_queries = userData.supports_inline_queries;
    }
}

module.exports = User;
