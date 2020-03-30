const { telegram } = require('../index');

exports.craps = {
    help: 'Heittää kaksi noppaa',
    usage: '/craps',
    func: (args, update) => {
        telegram.SendDice(update.chat, true).then(response => {
            let diceValue = response.dice.value;

            telegram.SendDice(update.chat, true).then(response => {
                diceValue += response.dice.value;
                
                setTimeout(() => {
                    telegram.SendMessage(update.chat, `Sait numeron ${diceValue}`);
                }, 4000);
            });
        });
    }
}
