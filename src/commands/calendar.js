const mongoUtil = require('../mongoUtil');
const helpCommands = require('./help');

const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/customParseFormat'));

let collection = undefined;
let GetCollection = () => {
    if (!collection) {
        collection = mongoUtil.getDb().collection('calendar');
    }
    
    return collection;
}

const parseDateTime = (date, time) => {
    let now = dayjs();
    
    let yearFromat = 'YYYY';

    let dateSplit = date.split('.');
    if (dateSplit.length === 1) {
        // date: 1
        date += `.${now.month()}.${now.year()}`;
    } 
    else if (dateSplit.length === 2) {
        if (dateSplit[1] === '') {
            // date: 1.
            date += `${now.month()}.${now.year()}`;
        }
        else {
            // date: 1.1
            date += `.${now.year()}`;
        }
    } 
    else if (dateSplit.length === 3) {
        if (dateSplit[2] === '') {
            // date: 1.1.
            date += `${now.year()}`;
        }
        else {
            if (dateSplit[2].length == 2) {
                // date: 1.1.20
                yearFromat = 'YY';
            }
            // else date: 1.1.2020
        }
    }

    let timeSplit = time.split('.')
    if (timeSplit.length === 1) {
        // time: 1
        let h = timeSplit[0].length == 1 ? `0${timeSplit[0]}` : timeSplit[0];
        time = `${h}.00.00`;
    }
    else if (timeSplit.length === 2)
    {
        let h = timeSplit[0].length == 1 ? `0${timeSplit[0]}` : timeSplit[0];
        let m = timeSplit[1].length == 1 ? `0${timeSplit[1]}` : timeSplit[1];
        time = `${h}.${m}.00`;
    }
    else if (timeSplit.length === 3)
    {
        let h = timeSplit[0].length == 1 ? `0${timeSplit[0]}` : timeSplit[0];
        let m = timeSplit[1].length == 1 ? `0${timeSplit[1]}` : timeSplit[1];
        let s = timeSplit[2].length == 1 ? `0${timeSplit[2]}` : timeSplit[2];
        time = `${h}.${m}.${s}`;
    }

    let dateTime = dayjs(`${date} ${time}`, `D.M.${yearFromat} HH.mm.ss`);
    return dateTime.format();
}


module.exports = (commander) => {
    commander.addCommand({
        commands: [ 'calendar', 'cal', 'kalenteri', 'events' ], 
        arguments: [],
        help: 'Lähettää kaikki tulevat tapahtumat', 

        func: (args, update, telegram) => {
            GetCollection().find({ dateTime: { $gte: new Date() } }).sort({dateTime: 1}).toArray((err, docs) => {
                if (docs.length > 0) {
                    let msg = '<b>Kalenteri:</b>';
                    for (let i in docs) {
                        msg += `\n  ${Number(i)+1}. ${dayjs(docs[i].dateTime).format('DD.MM.YYYY HH.mm')} - ${docs[i].description}`
                    }

                    telegram.SendMessage(update.chat, msg, { disable_notification: true, parse_mode: 'HTML' });
                } 
                else {
                    telegram.SendMessage(update.chat, 'Ei tapahtumia', { disable_notification: true });
                }
            });
        }
    });

    commander.addCommand({
        commands: [ 'addevent', 'adde', 'ae' ], 
        arguments: [ '<date>', '<time>', '<description>' ],
        help: 'Lisää uuden tapahtuman kalenteriin', 
        
        func: (args, update, telegram) => {
            if (args.length < 3) {
                helpCommands.usage.func([ "addevent" ], update);
                return;
            }

            let date = args.shift();
            let time = args.shift();
            let description = args.join(' ');

            let dateTime = parseDateTime(date, time);
            
            GetCollection().insertOne({ dateTime: new Date(dateTime), description });
            telegram.SendMessage(update.chat, `Tapahtuma lisätty`, { disable_notification: true });
        }
    });

    commander.addCommand({
        commands: [ 'removeevent', 'removee', 're' ], 
        arguments: [ '<id>' ],
        help: 'Poistaa tapahtuman kalenterista', 

        func: (args, update, telegram) => {
            if (args.length < 1) {
                helpCommands.usage.func([ "addevent" ], update);
                return;
            }

            id = Number(args[0]) - 1;

            GetCollection().find({ dateTime: { $gte: new Date() } }).sort({dateTime: 1}).toArray((err, docs) => {
                if (docs.length > id) {
                    GetCollection().deleteOne({ _id: docs[id]._id }, (err, results) => {
                        telegram.SendMessage(update.chat, `Tapahtuma "${docs[id].description}" poistettu`, { disable_notification: true });
                    });
                } 
                else {
                    telegram.SendMessage(update.chat, 'Tapahtumaa ei löytynt', { disable_notification: true });
                }
            });
        }
    });
}
