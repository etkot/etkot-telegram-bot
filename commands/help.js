module.exports = (commander) => {
    commander.addCommand({
        commands: [ 'help', 'h' ], 
        arguments: [ '[command]' ],
        help: 'Kertoo miten komentoa käytetään', 
    
        func: async (args, update, telegram) => {
            const commands = (await require('./index')()).commands;
            let msg = '';
    
            if (args.length > 0) {
                if (commands[args[0]]) {
                    msg = `${commands[args[0]].help}\nKäyttö: ${commands[args[0]].usage}`;
                } 
                else {
                    msg = `Komentoa ${args[0]} ei löydy\nKirjoita /help saadaksesi listan komennoista`;
                }
            }
            else {
                for (let cmd in commands) {
                    if (commands[cmd].master && commands[cmd].help) {
                        msg += `/${cmd} - ${commands[cmd].help}\n`;
                    }
                }
            }
    
            telegram.SendMessage(update.chat, msg, { disable_notification: true });
        }
    });

    commander.addCommand({
        commands: [ 'usage', 'u' ], 
        arguments: [ '<command>' ],
        help: 'Kertoo miten komentoa käytetään', 
    
        func: (args, update, telegram) => {
            const commands = require('./index');
            let msg;
    
            if (args.length === 0) {
                msg = `Käyttö: /usage <command>`;
            }
            else {
                msg = `Käyttö: ${commands.commands[args[0]].usage}`;
            }
    
            telegram.SendMessage(update.chat, msg, { disable_notification: true });
        }
    });
}