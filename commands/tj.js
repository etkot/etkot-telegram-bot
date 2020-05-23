const { telegram } = require('../index')

exports.tj = {
  help: 'Kertoo nykyisen tj:n',
  usage: '/tänäänjäljellä',
  aliases: ['tjlaskuri'],
  func: (args, update) => {
    const startDate = new Date(2020, 6, 6);
    const today = new Date();

    let tj = Math.abs(Math.floor(
        (Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) 
        - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) ) /(1000 * 60 * 60 * 24)));

    if (today < startDate) {
        telegram.SendMessage(update.chat, `Vielä *${tj}* aamua palveluksen alkamiseen.`, {parse_mode: "Markdown"})
    } 
    else if (today > startDate) {
        if (tj <= 347) {
            if (tj === 346) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj}* aamua.\n
                KOMPPANIASSA HERÄTYS!`,
                {parse_mode: "Markdown"})
            }
            else if (tj === 300) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj}* aamua.\n
                Oi oi sataset paukkuu jo!`,
                {parse_mode: "Markdown"})
            }
            else if (tj === 200) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj}* aamua.\n
                Tuntuuko kaksataa oikeesti enään missään?`, 
                {parse_mode: "Markdown"})
            }
            else if (tj === 182) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj}* aamua.\n
                En pidä puolenvuoden miehiä juuri minään.`, 
                {parse_mode: "Markdown"})
            }
            else if (tj === 173) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj}* aamua.\n
                Hei puolet käyty jo!`, 
                {parse_mode: "Markdown"})
            }
            else if (tj === 100) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj}* aamua.\n
                Sata salamaa iskee tulta!`, 
                {parse_mode: "Markdown"})
            }
            else if (tj === 92) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj}* aamua.\n
                Ei vielä saa luovuttaa.`, 
                {parse_mode: "Markdown"})
            }
            else if (tj === 90) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj}* aamua.\n
                https://www.youtube.com/watch?v=kxLwGow0Tvw`, 
                {parse_mode: "Markdown"})
            }
            else if (tj === 69) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj}* aamua.\n
                Lääh. https://www.youtube.com/watch?v=9f06QZCVUHg`, 
                {parse_mode: "Markdown"})
            } 
            else if (tj === 10) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj}* aamua.\n
                It's the final countdown`, 
                {parse_mode: "Markdown"})
            }
            else if (tj === 0) {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj}* aamua.\n
                Ohi on!! https://www.youtube.com/watch?v=uWF4DXP8ZFc`, 
                {parse_mode: "Markdown"})
            }
            else {
                telegram.SendMessage(update.chat, `Tänään jäljellä: *${tj}* aamua.`, {parse_mode: "Markdown"})
            } 
        } else {
            telegram.SendMessage(update.chat, `Ohi on! *${tj}* aamua sitten loppu jo.`, {parse_mode: "Markdown"})
        }
    } else {
        telegram.SendMessage(update.chat, `Noniin tänään mennään!\n*347* aamua edessä.`, {parse_mode: "Markdown"})
    }
  },
}
