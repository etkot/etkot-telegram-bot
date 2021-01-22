const untilEndMsg = [
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
        0: 'Ohi on!! https://www.youtube.com/watch?v=uWF4DXP8ZFc'
    }
]

exports.tj = {
  help: 'Kertoo nykyisen tj:n',
  usage: '/tänäänjäljellä',
  aliases: ['tjlaskuri'],
  func: (args, update, telegram) => {
    const startDate = new Date(2020, 6, 6)
    const endDate = new Date(2021, 5, 17)
    const today = new Date()

    const dayDiff = (d1, d2) => {
        return (Math.abs(Math.floor(
        (Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate()) -
        Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate())) / 
        (1000 * 60 * 60 * 24))))
    }

    const sendTJ = (tj, msg) => {
        telegram.SendMessage(update.chat, 
            `Tänään jäljellä: *${tj}* aamua.\n${msg}`,
            { parse_mode: 'Markdown'}, {disable_notification: true} )
    }

    let untilStart = dayDiff(today, startDate)
    let untilEnd = dayDiff(today, endDate)

    if (today < startDate) {
        telegram.SendMessage(update.chat, 
            `Vielä *${untilStart}* aamua palveluksen alkamiseen.`, 
            { parse_mode: "Markdown", disable_notification: true })
    }
    else if (today > endDate) {
        telegram.SendMessage(update.chat, 
            `Ohi on! *${untilEnd}* aamua sitten loppu jo.`, 
            { parse_mode: "Markdown", disable_notification: true })
    }
    else if (today > startDate) {
        
        let msg = ''
        untilEndMsg.forEach(message => {
            if (message[untilEnd]){
                msg=message[untilEnd] 
            }
        })
        
        sendTJ(untilEnd, msg)
    } 
    else {
        telegram.SendMessage(update.chat, 
            `Noniin tänään mennään!\n*347* aamua edessä.`, 
            { parse_mode: "Markdown", disable_notification: true })
    }
  },
}
