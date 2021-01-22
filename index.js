require('dotenv').config();
require('./mongoUtil').connectToServer(process.env.DB_NAME);

const tg = require('./telegram');
const telegram = new tg(process.env.TG_TOKEN);

let commands;

telegram.on('update', (update) => {
    //console.log(update);
});

telegram.on('message', (update) => {
    if (update.chat.id != Number(process.env.TG_CHAT)) {
        return;
    }

    if (update.text[0] == '/') {
        let args = update.text.substr(1).split(' ');
        let cmd = args.shift().replace(`@${telegram.user.username}`, '');

        if (commands.commands[cmd]) {
            commands.commands[cmd].func(args, update, telegram);
        }
    }
});

telegram.on('sticker', (update) => {
    if (update.chat.id != Number(process.env.TG_CHAT)) {
        return;
    }

    const func = commands.FindTrigger('sticker', update.sticker.file_unique_id);
    if (func) {
        func(update, telegram);
    }
});

telegram.on('newChatJoined', (update) => {
    if (update.chat.id != Number(process.env.TG_CHAT)) {
        telegram.SendMessage(update.chat, 'Paska ryhmä');
        setTimeout(() => {
            telegram.LeaveChat(update.chat);
        }, 100);
    }
});

require('./commands')()
    .then((cmds) => {
        commands = cmds;
        console.log('Commands loaded');

        telegram.StartPolling();
    })
    .catch((err) => {
        console.error('Could not initialize:', err);
        process.exit(1);
    })
