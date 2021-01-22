const fs = require('fs');

class Commander {
    constructor() {
        this.initializers = [];
        this.commands = {};
        this.triggers = {};
    }

    /**
     * Void function
     * @callback Func
     */

    /**
     * Add a new initializer
     * @param {Func} func - Function to run when this command is sent
     */
    addInitializer(func) {
        this.initializers.add(func);
    }

    /**
     * Command function
     * @callback CommandFunction
     * @param {String[]} args - Command arguments
     * @param {Object} update - Update object
     * @param {Object} telegram - Telegram Object
     */

    /**
     * Add a new command
     * @param {Object} data - Command data to add
     * @param {string[]} data.commands - All command variations
     * @param {string[]} data.arguments - Command arguments
     * @param {string} data.help - Help text to show with help command
     * @param {CommandFunction} data.func - Function to run when this command is sent
     */
    addCommand(data) {
        let i = 0;
        for (const cmd of data.commands) {
            if (this.commands[cmd] !== undefined) {
                throw `Cannot create command "${cmd}": Already exists`
            }

            this.commands[cmd] = Object.assign({ master: i === 0 }, data);
            i++;
        }
    }

    /**
     * Trigger function
     * @callback TriggerFunction
     * @param {Object} update - Update object
     * @param {Object} telegram - Telegram Object
     */

    /**
     * Add a new trigger
     * @param {Object} data - Command data to add
     * @param {string[]} data.ids - Ids of the trigger files (sticker, image, animation, etc.)
     * @param {TriggerFunction} data.func - Function to run when this command is sent
     */
    addTrigger(data) {
        for (const id of data.ids) {
            if (this.triggers[id] !== undefined) {
                throw `Cannot create trigger "${id}": Already exists`
            }

            this.triggers[id] = data;
        }
    }


    onInitialize() {
        for (const init of this.initializers) {
            init();
        }
    }

    onCommand(cmd, args, update, telegram) {
        if (this.commands[cmd] === undefined) {
            return false;
        }

        // TODO: Check argument count

        this.commands[cmd].func(args, update, telegram);
    }

    onTrigger(id, update, telegram) {
        if (this.triggers[id] === undefined) {
            return false;
        }
        
        this.triggers[id].func(update, telegram);
    }
}

const readdir = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) reject(err);
            resolve(files);
        });
    });
}

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        const commander = new Commander();
        
        // Load commands
        let files = await readdir('./commands');
        for (let file of files) {
            if (file !== 'index.js') {
                try {
                    require(`./${file}`)(commander);
                } catch (err) {
                    reject(err);
                }
            }
        }
        
        resolve(commander);
    });
}
