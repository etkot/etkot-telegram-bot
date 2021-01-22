const fs = require('fs');

const readdir = (dir) => {
    return new Promise(async (resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) reject(err);
            resolve(files);
        });
    });
}

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        let commands = {};
        let triggers = [];
        
        // Load commands
        let files = await readdir('./commands');
        for (let file of files) {
            if (file !== 'index.js') {
                let moduleCommands = require(`./${file}`);
        
                for (let c in moduleCommands) {
                    if (moduleCommands[c].func) {
                        if (commands[c] === undefined) {
                            commands[c] = moduleCommands[c];
                        }
                        else {
                            reject(`Cannot create command "${c}": Already exists (module: "${file}")`);
                        }
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
                        reject(`Cannot create alias for "${cmd}": Alias "${alias}" already exists for another command`);
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
                reject(`Cannot create alias: Command "${alias}" already exists`);
            }
            else {
                commands[alias] = aliases[alias];
            }
        }
        
        resolve({
            commands: commands,
            triggers: triggers,
        
            FindTrigger: (type, event) => {
                for (let trigger of triggers) {
                    if (trigger.type === type && trigger.on === event) {
                        return trigger.func;
                    }
                }
            }
        });
    });
}
