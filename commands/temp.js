const { telegram } = require('../index')
const axios = require('axios')
const port = process.env.LOMMI_API

const getTempData = async () => {
    let data = await axios.get(port)
    return data
}

exports.temp = {
    help: 'Antaan Lommin parvekkeen lämpötilan',
    usage: '/temp',
    aliases: ['t', 'lomminparveke'],
    func: async (args, update) => {
        const data = await getTempData()
        const temp = data.data.data.temperature
        const feels = data.data.data.feels_like
        telegram.SendMessage(
            update.chat, 
            `<b>Lämpötila: </b> ${Math.round(temp * 10) / 10}°C \n<b>Tuntuu kuin: </b> ${Math.round(feels * 10) / 10}°C`, 
            { disable_notification: true, parse_mode: 'html' })
    },
}
