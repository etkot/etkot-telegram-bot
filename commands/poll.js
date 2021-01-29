const helpCommands = require('./help');

const animals = [
    'Supikoira',
    'Ilves',
    'Pesukarhu',
    'Juovahyeena',
    'Harjasusi',
    'Seepramangusti',
    'Vesikko',
    'Nelisormimangusti',
    'Kalastajakissa',
    'Halli',
    'harmaahylje',
    'Siperiantiikeri',
    'Lumileopardi',
    'Hietakissa',
    'Aasianleijona',
    'Aavikkoilves',
    'Jääkarhu',
    'Amurinleopardi',
    'Maakotka',
    'Kuningasmerikotka',
    'Hiirihaukka',
    'Partakorppikotka',
    'Gauri viidakkohärkä',
    'Aksishirvi',
    'Myskihärkä',
    'Kaksikyttyräinen kameli',
    'Siperian alppikauris',
    'Kaspianuriaali',
    'Nuubian vuorikauris',
    'Turkmenian kierteissarvikauris',
    'Kubaninturi',
    'Sichuanin sinilammas',
    'Kaukasianvuorikauris',
    'Bukharanuriaali',
    'Koira',
    'Kissa',
    'Bengalin Tiikeri',
    'Boolilommi',
    'Salamanteri',
    'Elefantti',
    'Leijona',
    'Karhu',
    'Hirvi',
    'Peura',
    'Valas',
    'Delfiini',
    'Jänis',
    'Rusakko',
    'Lepakko',
    'Turri',
    'Orava',
    'Tero',
    'Sorsa',
    'Hyttynen',
    'Kärpänen',
    'Hämähakki',
    'Tunturisopuli',
    'Metsäsopuli',
    'Punamyyrä',
    'Harmaakuvemyyrä',
    'Metsämyyrä',
    'Vesimyyrä',
    'Piisami',
    'Idänkenttämyyrä',
    'Kenttämyyrä',
    'Peltomyyrä',
    'Lapinmyyrä',
];

const RandomAnimal = () => animals[Math.floor(Math.random() * Math.floor(animals.length))];

const Send = (cmd, args, update, telegram, anonymous) => {
    question = args.join(' ');
    let reply = undefined;

    if (update.reply_to_message) {
        reply = update.reply_to_message.message_id;
    }

    if (question === '') {
        question = ' ';
    }
    
    if (question === ' ' && !reply) {
        helpCommands.usage.func([ cmd ], update);
        return;
    }

    telegram.SendPoll(update.chat, question, [ 'tää', 'epätää', RandomAnimal() ], { is_anonymous: anonymous, disable_notification: true, reply_to_message_id: reply });
}

module.exports = (commander) => {
    commander.addCommand({
        commands: [ 'poll', 'p' ], 
        arguments: [ '<question>' ],
        help: 'Lähettää pollin', 
        
        func: (args, update, telegram) => {
            Send('poll', args, update, telegram, false);
        }
    });

    commander.addCommand({
        commands: [ 'pollanonymous', 'pollanon', 'pa' ], 
        arguments: [ '<question>' ],
        help: 'Lähettää anonyymin pollin', 
        
        func: (args, update, telegram) => {
            Send('pollanonymous', args, update, telegram, true);
        }
    });
}