const { telegram } = require('../index');
const helpCommands = require('./help');

const applicableLetters = new Map([['k','g'],['t','d'],['p','b'],
                                    ['K','G'],['T','D'],['P','B']]);

const processLetter = character => {

    if(applicableLetters.has(character)) {
        character = applicableLetters.get(character);
    }
    else if (character === " " && Math.random() < 0.3) {
        return " :DDD ";
    }
    return character;
}


const processMessage = (cmd, args, update) => {
    message = args.join(' ');
    let reply = undefined;

    if (update.reply_to_message) {
        reply = update.reply_to_message.message_id;
    }

    if ((message === '' || message === ' ') && !reply) {
        helpCommands.usage.func([ cmd ], update);
        return;
    }

    let newMessage = "Ei viddu mage :DDDD ";
    for (let i = 0; i < message.length; i++) {
        newMessage += processLetter(message[i]);
    }

    telegram.SendMessage(update.chat, newMessage,
        {disable_web_page_preview: true, disable_notification: true,
            reply_to_message_id: reply});
}


exports.spudro = {
    help: 'Muuddaa degsdin spudromuodoon :DDD',
    usage: '/spudro <question>',
    aliases: [ 'spudrofy', 'spädre' ],
    func: (args, update) => {
        processMessage('spudro', args, update)
    }
}