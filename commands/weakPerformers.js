const { telegram } = require('../index')
const helpCommands = require('./help')
const mongoUtil = require('../mongoUtil');

let collection = undefined;
let GetCollection = () => {
    if (!collection) {
        collection = mongoUtil.getDb().collection('heikot');
    }

    return collection;
}

exports.weakPerformers = {
    help: 'Listaa heikot suorittajat ',
    usage: '/heikot',
    aliases: ['heikot', 'weakPeople', 'weak'],
    func: (args, update) => {
        GetCollection().find({}).toArray((err, docs) => {
            let msg = '<b>Heikkojen suorittajien lista:</b>\n'
            for (let doc of docs) {
                msg += `  ${doc.name}\n`
            }
            telegram.SendMessage(update.chat, msg, { disable_notification: true, parse_mode: 'html' })
        })
    },
}

exports.addPerformer = {
    help: 'Lisää uuden heikon suorittaja',
    usage: '/lisääHeikko',
    aliases: ['lisääHeikko', 'addH', 'aH'],
    func: (args, update) => {
        if (args.length < 1) {
            helpCommands.usage.func([ 'addPerformer' ], update);
            return;
        }

        let name = args.shift().trim()

        GetCollection().findOne({name}, (err, result) => {
            if (result === null ) {
                GetCollection().insertOne({ name })
                telegram.SendMessage(update.chat, 
                    `Heikko suorittaja lisätty`, 
                    { disable_notification: true })
            } else {
                telegram.SendMessage(update.chat, 
                    `Kyseinen henkilö on jo suoriutunut heikosti`,
                    { disable_notification: true })
            }
        })
    }
}
