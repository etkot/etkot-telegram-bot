const mongoUtil = require('../mongoUtil');
const { telegram } = require('../index');
const helpCommands = require('./help');

let collection = undefined;
let GetCollection = () => {
    if (!collection) {
        collection = mongoUtil.getDb().collection('quotes');
    }
    
    return collection;
}

exports.quote = {
    help: 'Lähettää satunnaisen quoten',
    usage: '/quote [name]',
    aliases: [ 'q', 'quoite', 'quoye' ],
    func: (args, update) => {
        let query = {};
        if (args.length > 0) {
            query.name = new RegExp(`^${args[0]}$`,'i');
        }

        GetCollection().find(query).toArray((err, docs) => {
            if (docs.length > 0) {
                let selectedQuote = docs[Math.floor(Math.random() * docs.length)];
                telegram.SendMessage(update.chat, `"${selectedQuote.quote}" - ${selectedQuote.name}`, { disable_notification: true });
            } 
            else {
                telegram.SendMessage(update.chat, 'Tuolta henkilöltä ei löydy quoteja :(', { disable_notification: true });
            }
        });
    }
}

exports.addq = {
    help: 'Lisää uuden quoten käyttäjälle',
    usage: '/addq <name> <quote>',
    aliases: [ 'aq' ],
    func: (args, update) => {
        if (args.length < 2) {
            helpCommands.usage.func([ "addq" ], update);
            return;
        }

        let name = args.shift();
        let quote = args.join(' ');
        
        GetCollection().findOne({name, quote}, (err, result) => {
            if (result === null) {
                GetCollection().insertOne({ name, quote });
                telegram.SendMessage(update.chat, `Quote lisätty`, { disable_notification: true });
            } else {
                telegram.SendMessage(update.chat, `Quote on jo olemassa`, { disable_notification: true });
            }
        });
    }
}

exports.quotestats = {
    help: 'Näyttää kuinka monta quotea käyttäjillä on',
    usage: '/quotestats',
    aliases: [ 'qs', 'qstats' ],
    func: (args, update) => {
        GetCollection().aggregate([ { $group : { _id : '$name', count : { $sum : 1 } } } ]).toArray((err, result) => {
            result.sort((a, b) => { 
                if (b.count - a.count !== 0) {
                    return b.count - a.count;
                }
                if (a._id > b._id) return 1;
                if (a._id < b._id) return -1;
                return 0;
            });

            let str = '<b>Quote stats</b>\n';
            for (const user of result) {
                str += `${user._id}: ${user.count}\n`;
            }

            telegram.SendMessage(update.chat, str, { disable_notification: true, parse_mode: 'HTML' });
        });
    }
}
