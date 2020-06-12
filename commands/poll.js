const { telegram } = require('../index');
const helpCommands = require('./help');

const Send = (cmd, args, update, anonymous) => {
    let question = '';
    let reply = undefined;

    if (args.length < 1) {
        if (update.reply_to_message) {
            question = ' ';
            reply = update.reply_to_message.message_id;
        }
        else {
            helpCommands.usage.func([ cmd ], update);
            return;
        }
    }
    else {
        question = args.join(' ');
    }

    telegram.SendPoll(update.chat, question, [ 'tää', 'epätää' ], { is_anonymous: anonymous, disable_notification: true, reply_to_message_id: reply });
}

exports.poll = {
    help: 'Lähettää pollin',
    usage: '/poll <question>',
    aliases: [ 'p' ],
    func: (args, update) => {
        Send('poll', args, update, false);
    }
}

exports.pollanonymous = {
    help: 'Lähettää anonyymin pollin',
    usage: '/pollanonymous <question>',
    aliases: [ 'pollanon', 'pa' ],
    func: (args, update) => {
        Send('pollanonymous', args, update, true);
    }
}
