const { telegram } = require('../index')

exports.tj = {
  help: 'Kertoo nykyisen tj:n',
  usage: '/tänäänjäljellä',
  aliases: ['tjlaskuri'],
  func: (args, update) => {
    const startDate = new Date(2020, 6, 6)
    const endDate = new Date(2021, 6, 17)
    const today = new Date()

    const dayDiff = (d1, d2) => {
           return (Math.abs(Math.floor(
            (Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate()) 
            - Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate()) ) 
            /(1000 * 60 * 60 * 24))))
    }

    let tj1 = dayDiff(today, startDate)
    let tj2 = dayDiff(today, endDate)    

    if (today < startDate) {
        telegram.SendMessage(update.chat, `Vielä *${tj1}* aamua palveluksen alkamiseen.`, {parse_mode: "Markdown"})
    } 
    else if (today < endDate) {
        if (tj2 <= 347) {
            if (tj2 === 346) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj2}* aamua.\n
                KOMPPANIASSA HERÄTYS!`,
                {parse_mode: "Markdown"})
            }
            else if (tj2 === 300) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj2}* aamua.\n
                Oi oi sataset paukkuu jo!`,
                {parse_mode: "Markdown"})
            }
            else if (tj2 === 200) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj2}* aamua.\n
                Tuntuuko kaksataa oikeesti enään missään?`, 
                {parse_mode: "Markdown"})
            }
            else if (tj2 === 182) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj2}* aamua.\n
                En pidä puolenvuoden miehiä juuri minään.`, 
                {parse_mode: "Markdown"})
            }
            else if (tj2 === 173) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj2}* aamua.\n
                Hei puolet käyty jo!`, 
                {parse_mode: "Markdown"})
            }
            else if (tj2 === 100) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj2}* aamua.\n
                Sata salamaa iskee tulta!`, 
                {parse_mode: "Markdown"})
            }
            else if (tj2 === 92) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj2}* aamua.\n
                Ei vielä saa luovuttaa.`, 
                {parse_mode: "Markdown"})
            }
            else if (tj2 === 90) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj2}* aamua.\n
                https://www.youtube.com/watch?v=kxLwGow0Tvw`, 
                {parse_mode: "Markdown"})
            }
            else if (tj2 === 69) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj2}* aamua.\n
                Lääh. https://www.youtube.com/watch?v=9f06QZCVUHg`, 
                {parse_mode: "Markdown"})
            } 
            else if (tj2 === 10) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj2}* aamua.\n
                It's the final countdown`, 
                {parse_mode: "Markdown"})
            }
            else if (tj2 === 0) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj2}* aamua.\n
                Ohi on!! https://www.youtube.com/watch?v=uWF4DXP8ZFc`, 
                {parse_mode: "Markdown"})
            }
            else {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj2}* aamua.`, {parse_mode: "Markdown"})
            } 
        } else {
            telegram.SendMessage(update.chat, `Ohi on! *${tj2}* aamua sitten loppu jo.`, {parse_mode: "Markdown"})
        }
    } else {
        telegram.SendMessage(update.chat, `Noniin tänään mennään!\n*347* aamua edessä.`, {parse_mode: "Markdown"})
    }
  },
}
