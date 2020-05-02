const fs = require('fs');

let commands = {};
let triggers = [];

// Load commands
let files = fs.readdirSync('./commands');
for (let file of files) {
    if (file !== 'index.js') {
        let moduleCommands = require(`./${file}`);

        for (let c in moduleCommands) {
            if (moduleCommands[c].func) {
                commands[c] = moduleCommands[c];
            }
            
            for (let t in moduleCommands[c].triggers) {
                triggers.push(moduleCommands[c].triggers[t]);
            }
        }
    }
}

let aliases = {};

// Get aliases from commands
for (let cmd in commands) {
    if (commands[cmd].aliases) {
        for (let alias of commands[cmd].aliases) {
            if (aliases[alias]) {
                console.error(`Cannot create alias for "${cmd}": Alias "${alias}" already exists`);
            }
            else {
                aliases[alias] = Object.assign({}, commands[cmd]);
                aliases[alias].help = undefined;
            }
        }
    }
}

// Put aliases in the commands object
for (let alias in aliases) {
    if (commands[alias]) {
        console.error(`Cannot create alias: Command "${alias}" already exists`);
    }
    else {
        commands[alias] = aliases[alias];
    }
}

module.exports = {
    commands: commands,
    triggers: triggers,

    FindTrigger: (type, event) => {
        for (let trigger of triggers) {
            if (trigger.type === type && trigger.on === event) {
                return trigger.func;
            }
        }
    }
}
