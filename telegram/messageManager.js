const Message = require('./message');

class MessageManager {
    constructor() {
        /**
         * Map of the cached messages
         * @private
         */
        this._messages = new Map();
    }

    /**
     * Finds and returns a message
     * @param {Message} message - Message to get. Will create a new message if this id doesn't exist
     * @returns {Message}
     */
    GetMessage(message) {
        let messageFound = this._messages.get(message.id);
        if (messageFound === undefined) {
            messageFound = new Message(message);
            this._messages.set(message.id, messageFound);
        }

        return messageFound;
    }
}

module.exports = MessageManager;
