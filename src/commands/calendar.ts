import { getCollection } from '../mongoUtil'

import dayjs from 'dayjs'
import { Commander } from '.'

import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const parseDateTime = (date: string, time: string) => {
    const now = dayjs()

    let yearFromat = 'YYYY'

    const dateSplit = date.split('.')
    if (dateSplit.length === 1) {
        // date: 1
        date += `.${now.month()}.${now.year()}`
    } else if (dateSplit.length === 2) {
        if (dateSplit[1] === '') {
            // date: 1.
            date += `${now.month()}.${now.year()}`
        } else {
            // date: 1.1
            date += `.${now.year()}`
        }
    } else if (dateSplit.length === 3) {
        if (dateSplit[2] === '') {
            // date: 1.1.
            date += `${now.year()}`
        } else {
            if (dateSplit[2].length == 2) {
                // date: 1.1.20
                yearFromat = 'YY'
            }
            // else date: 1.1.2020
        }
    }

    const timeSplit = time.split('.')
    if (timeSplit.length === 1) {
        // time: 1
        const h = timeSplit[0].length == 1 ? `0${timeSplit[0]}` : timeSplit[0]
        time = `${h}.00.00`
    } else if (timeSplit.length === 2) {
        const h = timeSplit[0].length == 1 ? `0${timeSplit[0]}` : timeSplit[0]
        const m = timeSplit[1].length == 1 ? `0${timeSplit[1]}` : timeSplit[1]
        time = `${h}.${m}.00`
    } else if (timeSplit.length === 3) {
        const h = timeSplit[0].length == 1 ? `0${timeSplit[0]}` : timeSplit[0]
        const m = timeSplit[1].length == 1 ? `0${timeSplit[1]}` : timeSplit[1]
        const s = timeSplit[2].length == 1 ? `0${timeSplit[2]}` : timeSplit[2]
        time = `${h}.${m}.${s}`
    }

    const dateTime = dayjs(`${date} ${time}`, `D.M.${yearFromat} HH.mm.ss`)
    return dateTime.format()
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['calendar', 'cal', 'kalenteri', 'events'],
        arguments: [],
        help: 'Lähettää kaikki tulevat tapahtumat',

        func: (args, message, telegram) => {
            getCollection('calendar')
                .find({ dateTime: { $gte: new Date() } })
                .sort({ dateTime: 1 })
                .toArray((err, docs) => {
                    if (docs.length > 0) {
                        let msg = '<b>Kalenteri:</b>'
                        for (const i in docs) {
                            msg += `\n  ${Number(i) + 1}. ${dayjs(docs[i].dateTime).format('DD.MM.YYYY HH.mm')} - ${
                                docs[i].description
                            }`
                        }

                        telegram.sendMessage(message.chat.id, msg, { disable_notification: true, parse_mode: 'HTML' })
                    } else {
                        telegram.sendMessage(message.chat.id, 'Ei tapahtumia', { disable_notification: true })
                    }
                })
        },
    })

    commander.addCommand({
        commands: ['addevent', 'adde', 'ae'],
        arguments: ['<date>', '<time>', '<description>'],
        help: 'Lisää uuden tapahtuman kalenteriin',

        func: (args, message, telegram) => {
            const date = args.shift() as string
            const time = args.shift() as string
            const description = args.join(' ')

            const dateTime = parseDateTime(date, time)

            getCollection('calendar').insertOne({ dateTime: new Date(dateTime), description })
            telegram.sendMessage(message.chat.id, `Tapahtuma lisätty`, { disable_notification: true })
        },
    })

    commander.addCommand({
        commands: ['removeevent', 'removee', 're'],
        arguments: ['<id>'],
        help: 'Poistaa tapahtuman kalenterista',

        func: (args, message, telegram) => {
            const id = Number(args[0]) - 1

            getCollection('calendar')
                .find({ dateTime: { $gte: new Date() } })
                .sort({ dateTime: 1 })
                .toArray((err, docs) => {
                    if (docs.length > id) {
                        getCollection('calendar').deleteOne({ _id: docs[id]._id }, () => {
                            telegram.sendMessage(message.chat.id, `Tapahtuma "${docs[id].description}" poistettu`, {
                                disable_notification: true,
                            })
                        })
                    } else {
                        telegram.sendMessage(message.chat.id, 'Tapahtumaa ei löytynt', { disable_notification: true })
                    }
                })
        },
    })
}
