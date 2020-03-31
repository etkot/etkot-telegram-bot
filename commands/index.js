const { help, usage } = require('./help');
const { quote, addq } = require('./quote');
const { craps } = require('./craps');
const { minecraft } = require('./minecraft');

let commands = {
    // Help
    help, usage,

    // Quote
    quote, addq,
    
    // Craps
    craps,

    // Minecraft
    minecraft,
}

let aliases = {};

// Get aliases from commands
for (let cmd in commands) {
    if (commands[cmd].aliases) {
        for (let alias of commands[cmd].aliases) {
            if (aliases[alias]) {
                console.error(`Cannot create alias: Alias "${alias}" already exists`);
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

module.exports = commands;
