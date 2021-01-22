const mongodb = require('mongodb');
const mongoUtil = require('../mongoUtil');
const helpCommands = require('./help');

let collection = undefined;

/**
 * @returns {mongodb.Collection}
 */
const GetCollection = () => {
    if (!collection) {
        collection = mongoUtil.getDb().collection('credit');
    }
    
    return collection;
}

module.exports = (commander) => {
    commander.addCommand({
        commands: [ 'socialcredit', 'credit', 'sc' ], 
        arguments: [],
        help: 'Listaa kaikkien pisteet', 

        func: (args, update, telegram) => {
            GetCollection().find({}).toArray((err, docs) => {
                let users = {};
                for (let doc of docs) {
                    if (users[doc.username] === undefined)
                        users[doc.username] = 0;

                    for (let credit in doc.plus_credits)
                        users[doc.username]++;
                    for (let credit in doc.minus_credits)
                        users[doc.username]--;
                }

                var sortable = [];
                for (var user in users) {
                    sortable.push({ user, credit: users[user] });
                }

                sortable.sort(function(a, b) {
                    return b.credit - a.credit;
                });

                let msg = '<b>Social credit:</b>\n';
                for (let obj of sortable) {
                    msg += `  ${obj.user}: ${obj.credit * 20}\n`;
                }

                telegram.SendMessage(update.chat, msg, { disable_notification: true, parse_mode: 'html' });
            });
        }
    });

    commander.addTrigger({
        ids: [ 'AgADAgADf3BGHA' ],
        func: (update) => {
            if (update.reply_to_message === undefined)
                return;

            const fromUser = update.from.username;
            const toUser = update.reply_to_message.from.username;
            
            const credit = {
                from: fromUser,
                msg: update.reply_to_message.message_id,
                date: update.date,
            }
        
            GetCollection().updateOne({ username: toUser }, { $push: { plus_credits: credit } })
                .then((result) => {
                    if (result.modifiedCount == 0) {
                        GetCollection().insertOne({ username: toUser, plus_credits: [ credit ] });
                    }
                });
        }
    });
    commander.addTrigger({
        ids: [ 'AgADAwADf3BGHA' ],
        func: (update) => {
            if (update.reply_to_message === undefined)
                return;
            
            const fromUser = update.from.username;
            const toUser = update.reply_to_message.from.username;
            
            const credit = {
                from: fromUser,
                msg: update.reply_to_message.message_id,
                date: update.date,
            }
        
            GetCollection().updateOne({ username: toUser }, { $push: { minus_credits: credit } })
                .then((result) => {
                    if (result.modifiedCount == 0) {
                        GetCollection().insertOne({ username: toUser, minus_credits: [ credit ] });
                    }
                });
        }
    });
}