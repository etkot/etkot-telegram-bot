module.exports = (commander) => {
    commander.addCommand({
        commands: [ 'craps', 'c' ], 
        arguments: [],
        help: 'Heittää kaksi noppaa', 

        func: (args, update, telegram) => {
            telegram.SendDice(update.chat, { disable_notification: true }).then(response => {
                let diceValue = response.dice.value;

                telegram.SendDice(update.chat, { disable_notification: true }).then(response => {
                    diceValue += response.dice.value;
                    
                    setTimeout(() => {
                        telegram.SendMessage(update.chat, diceValue === 2 ? '🐍 SNAKE 🐍 EYES 🐍' : `Sait numeron ${diceValue}`, { disable_notification: true, reply_to_message_id: update.message_id });
                    }, 4000);
                });
            });
        }
    });
}
