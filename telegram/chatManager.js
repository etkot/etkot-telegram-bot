const Chat = require('./chat');

class ChatManager {
    constructor() {
        /**
         * Map of the cached chats
         * @private
         */
        this._chats = new Map();
    }

    /**
     * Finds and returns a chat
     * @param {Chat} chat - Chat to get. Will create a new chat if this id doesn't exist
     * @returns {Chat}
     */
    GetChat(chat) {
        let chatFound = this._chats.get(chat.id);
        if (chatFound === undefined) {
            chatFound = new Chat(chat);
            this._chats.set(chat.id, chatFound);
        }

        return chatFound;
    }
}

module.exports = ChatManager;
