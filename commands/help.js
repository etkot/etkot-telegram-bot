exports.help = {
    usage: '/help [command]',
    aliases: [ 'h' ],
    func: (args, update, telegram) => {
        const commands = require('./index').commands;
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
                if (commands[cmd].help) {
                    msg += `/${cmd} - ${commands[cmd].help}\n`;
                }
            }
        }

        telegram.SendMessage(update.chat, msg, { disable_notification: true });
    }
}

exports.usage = {
    help: 'Kertoo miten komentoa käytetään',
    usage: '/usage <command>',
    aliases: [ 'u' ],
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
}