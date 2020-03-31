const { telegram } = require('../index');

exports.craps = {
    help: 'Heittää kaksi noppaa',
    usage: '/craps',
    aliases: [ 'c' ],
    func: (args, update) => {
        telegram.SendDice(update.chat, { disable_notification: true }).then(response => {
            let diceValue = response.dice.value;

            telegram.SendDice(update.chat, { disable_notification: true }).then(response => {
                diceValue += response.dice.value;
                
                setTimeout(() => {
                    telegram.SendMessage(update.chat, `Sait numeron ${diceValue}`, { disable_notification: true, reply_to_message_id: update.message_id });
                }, 4000);
            });
        });
    }
}
