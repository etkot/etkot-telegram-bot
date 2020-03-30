require('dotenv').config();
require('./mongoUtil').connectToServer(process.env.DB_NAME);

const tg = require('./telegram');
const telegram = new tg(process.env.TG_TOKEN);
exports.telegram = telegram;

const commands = require('./commands');

telegram.on('update', (update) => {
    console.log(update);
});

telegram.on('message', (update) => {
    if (update.chat.id != Number(process.env.TG_CHAT)) {
        return;
    }

    if (update.text[0] == '/') {
        let args = update.text.substr(1).split(' ');
        let cmd = args.shift().replace(`@${telegram.user.username}`, '');

        commands[cmd].func(args, update);
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

setTimeout(() => {
    telegram.StartPolling();
}, 1000);
