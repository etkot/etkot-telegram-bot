const User = require('./user');

class UserManager {
    constructor() {
        /**
         * Map of the cached users
         * @private
         */
        this._users = new Map();
    }

    /**
     * Finds and returns a user
     * @param {User} user - User to get. Will create a new user if this id doesn't exist
     * @returns {User}
     */
    GetUser(user) {
        let userFound = this._users.get(user.id);
        if (userFound === undefined) {
            userFound = new User(user);
            this._users.set(user.id, userFound);
        }

        return userFound;
    }
}

module.exports = UserManager;
