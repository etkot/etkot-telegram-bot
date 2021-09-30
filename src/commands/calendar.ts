import { getCollection } from '../mongoUtil'

import dayjs from 'dayjs'
import { Commander } from '.'

import arraySupport from 'dayjs/plugin/arraySupport'
import { ObjectId } from 'mongodb'
dayjs.extend(arraySupport)

interface EventDocument {
    _id?: ObjectId
    dateTime: Date
    description: string
}

const parseDateTime = (date: string, time: string) => {
    const now = dayjs()

    const dateSplit = date.split(/[.:\-_]/g)
    const timeSplit = time.split(/[.:\-_]/g)

    let year = Number(dateSplit[2]),
        month = Number(dateSplit[1])
    const day = Number(dateSplit[0]),
        hours = Number(timeSplit[0]) || 0,
        minutes = Number(timeSplit[1]) || 0,
        seconds = Number(timeSplit[2]) || 0

    if (!year && !month && !day) {
        return undefined
    }

    if (!year && !month) {
        if (day && Number(day) < now.date()) {
            month = now.month() + 2
            if (month === 13) month = 1
        } else {
            month = now.month() + 1
        }
    }
    month -= 1

    if (!year) {
        if (month && Number(month) < now.month()) {
            year = now.year() + 1
        } else {
            year = now.year()
        }
    }

    if (year < 100) {
        year += 2000
    }

    const dateTime = dayjs([year, month, day, hours, minutes, seconds])
    return dateTime.format()
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['calendar', 'cal', 'kalenteri', 'events', 'calender'],
        arguments: [],
        help: 'Lähettää kaikki tulevat tapahtumat',

        func: (args, message, telegram) => {
            getCollection<EventDocument>('calendar')
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

            if (!dateTime) {
                return false
            }

            getCollection<EventDocument>('calendar')
                .insertOne({ dateTime: new Date(dateTime), description })
                .then((result) => {
                    const msg = `Tapahtuma lisätty\n${dayjs(new Date(dateTime)).format(
                        'DD.MM.YYYY HH.mm'
                    )} - ${description}`
                    telegram.sendMessage(message.chat.id, msg, { disable_notification: true, parse_mode: 'HTML' })
                })
        },
    })

    commander.addCommand({
        commands: ['removeevent', 'removee', 're', 'deleteevent', 'deletee', 'de'],
        arguments: ['<id>'],
        help: 'Poistaa tapahtuman kalenterista',

        func: (args, message, telegram) => {
            const id = Number(args[0]) - 1

            getCollection<EventDocument>('calendar')
                .find({ dateTime: { $gte: new Date() } })
                .sort({ dateTime: 1 })
                .toArray((err, docs) => {
                    if (docs.length > id) {
                        getCollection<EventDocument>('calendar').deleteOne({ _id: docs[id]._id }, () => {
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
