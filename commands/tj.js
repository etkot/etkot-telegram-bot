const { telegram } = require('../index')

exports.tj = {
  help: 'Kertoo nykyisen tj:n',
  usage: '/tänäänjäljellä',
  aliases: ['tjlaskuri'],
  func: (args, update) => {
    const startDate = new Date(2020, 6, 6)
    const endDate = new Date(2021, 5, 18)
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
        if (untilEnd === 346) {
            msg = 'KOMPPANIASSA HERÄTYS!'
        } else if (untilEnd === 300) {
            msg = 'Oi oi sataset paukkuu jo!'
        } else if (untilEnd === 270) {
            msg = 'https://www.youtube.com/watch?v=26zVagt8bck'
        } else if (untilEnd === 200) {
            msg = 'Tuntuuko kaksataa aamua oikeesti enään missään?'
        } else if (untilEnd === 182) {
            msg = 'Itsehän en pidä puolenvuoden miehiä juuri minään.'
        } else if (untilEnd === 173) {
            msg = 'Hei puolet käyty jo!'
        } else if (untilEnd === 112) {
            msg = 'https://www.youtube.com/watch?v=iN43sSF-Q3k'
        } else if (untilEnd === 108) {
            msg = 'https://www.youtube.com/watch?v=EnbjR635kfc'
        } else if (untilEnd === 100) {
            msg = 'Sata salamaa iskee tulta!'
        } else if (untilEnd === 99) {
            msg = 'https://www.youtube.com/watch?v=6uikJTnmtgw'
        } else if (untilEnd === 92) {
            msg = 'Ei vielä saa luovuttaa.'
        } else if (untilEnd === 90) {
            msg = 'https://www.youtube.com/watch?v=kxLwGow0Tvw'
        } else if (untilEnd === 69) {
            msg = 'Heh https://www.youtube.com/watch?v=9f06QZCVUHg'
        } else if (untilEnd === 10) {
            msg = "It's the final countdown!"
        } else if (untilEnd === 0) {
            msg = 'Ohi on!! https://www.youtube.com/watch?v=uWF4DXP8ZFc'
        } sendTJ(untilEnd, msg)
    } 
    else {
        telegram.SendMessage(update.chat, 
            `Noniin tänään mennään!\n*347* aamua edessä.`, 
            { parse_mode: "Markdown", disable_notification: true })
    }
  },
}
