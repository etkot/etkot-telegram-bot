import { Commander } from '.'

const untilEndMsg: Array<{ [key: number]: string }> = [
    {
        300: 'KOMPPANIASSA HERÄTYS!',
        281: 'Menisitte tekin oikeisiin töihin',
        270: 'https://www.youtube.com/watch?v=26zVagt8bck',
        200: 'Tuntuuko kaksataa aamua oikeesti enään missään?',
        182: 'Itsehän en pidä puolenvuoden miehiä juuri minään.',
        173: 'Hei puolet käyty jo!',
        112: 'https://www.youtube.com/watch?v=iN43sSF-Q3k',
        108: 'https://www.youtube.com/watch?v=EnbjR635kfc',
        100: 'Sata salamaa iskee tulta!',
        99: 'https://www.youtube.com/watch?v=6uikJTnmtgw',
        92: 'Ei vielä saa luovuttaa.',
        90: 'https://www.youtube.com/watch?v=kxLwGow0Tvw',
        69: 'Heh https://www.youtube.com/watch?v=9f06QZCVUHg',
        10: "It's the final countdown!",
        0: 'Ohi on!! https://www.youtube.com/watch?v=uWF4DXP8ZFc',
    },
]

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['tj', 'tänäänjäljellä', 'tjlaskuri'],
        arguments: [],
        help: 'Kertoo nykyisen tj:n',

        func: (args, message, telegram) => {
            const startDate = new Date(2020, 6, 6)
            const endDate = new Date(2021, 5, 17)
            const today = new Date()

            const dayDiff = (d1: Date, d2: Date) => {
                return Math.abs(
                    Math.floor(
                        (Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate()) -
                            Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate())) /
                            (1000 * 60 * 60 * 24)
                    )
                )
            }

            const sendTJ = (tj: number, msg: string) => {
                telegram.sendMessage(message.chat.id, `Tänään jäljellä: *${tj}* aamua.\n${msg}`, {
                    parse_mode: 'Markdown',
                    disable_notification: true,
                })
            }

            const untilStart = dayDiff(today, startDate)
            const untilEnd = dayDiff(today, endDate)

            if (today < startDate) {
                telegram.sendMessage(message.chat.id, `Vielä *${untilStart}* aamua palveluksen alkamiseen.`, {
                    parse_mode: 'Markdown',
                    disable_notification: true,
                })
            } else if (today > endDate) {
                telegram.sendMessage(message.chat.id, `Ohi on! *${untilEnd}* aamua sitten loppu jo.`, {
                    parse_mode: 'Markdown',
                    disable_notification: true,
                })
            } else if (today > startDate) {
                let msg = ''
                untilEndMsg.forEach((message) => {
                    if (message[untilEnd]) {
                        msg = message[untilEnd]
                    }
                })

                sendTJ(untilEnd, msg)
            } else {
                telegram.sendMessage(message.chat.id, `Noniin tänään mennään!\n*347* aamua edessä.`, {
                    parse_mode: 'Markdown',
                    disable_notification: true,
                })
            }
        },
    })
}
