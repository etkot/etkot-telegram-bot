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
    func: (args, update, telegram) => {
        GetCollection().find({}).toArray((err, docs) => {
            if (docs.length !== 0) {
                let msg = '<b>Heikkojen suorittajien lista:</b>\n'
                for (let doc of docs) {
                    msg += `  ${doc.name} x${doc.score}\n`
                }
                telegram.SendMessage(update.chat, msg, { disable_notification: true, parse_mode: 'html' })
            } else {
                telegram.SendMessage(update.chat, 'Kukaan ei ole suorittanut heikosti', 
                    { disable_notification: true, parse_mode: 'html' })
            }
        })
    },
}

exports.addPerformer = {
    help: 'Lisää uuden heikon suorittaja',
    usage: '/lisääHeikko',
    aliases: ['lisääHeikko', 'addH', 'aH'],
    func: (args, update, telegram) => {
        if (args.length < 1) {
            helpCommands.usage.func([ 'addPerformer' ], update);
            return;
        }

        let name = args.shift().trim()
        let score = 1

        GetCollection().findOne({name, score}, (err, result) => {
            if (result === null ) {
                GetCollection().insertOne({ name, score })
                telegram.SendMessage(update.chat, 
                    `Heikko suorittaja lisätty`, 
                    { disable_notification: true })
            } else {
                GetCollection().updateOne({name: result.name}, { $inc: {score: 1}})
                telegram.SendMessage(update.chat, 
                    `Uusi heikko suoritus lisätty`,
                    { disable_notification: true })
            }
        })
    }
}
