const axios = require("axios")
const cheerio = require("cheerio")

const { telegram } = require("../index")

exports.meme = {
    help: "Suomen top daily video",
    usage: "/ph",
    aliases: ["xxx", "fap"],
    func: async (args, update) => {
        const response = await axios({
            method: "GET",
            url: "https://www.pornhub.com/video?o=mv&t=t&cc=fi",
        })
        try {
            const $ = cheerio.load(response.data)
            const videos = Array.from($(".thumbnail-info-wrapper > span.title > a"))
            if (videos.length && videos[0].attribs && videos[0].attribs.href) {
                const msg = `**Suomen top daily video**\nhttps://pornhub.com${videos[0].attribs.href}`
                telegram.SendMessage(update.chat, msg, { disable_notification: true })
            } else {
                telegram.SendMessage(update.chat, "Can't fetch content atm :(", { disable_notification: true })
            }
        } catch (e) {
            telegram.SendMessage(update.chat, "Can't fetch content atm :(", { disable_notification: true })
        }
    },
}
