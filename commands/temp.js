const axios = require('axios')
const port = process.env.LOMMI_API

const getTempData = async () => {
    let data = await axios.get(port)
    return data
}

module.exports = (commander) => {
    commander.addCommand({
        commands: [ 'temp', 't', 'lomminparveke' ], 
        arguments: [],
        help: 'Antaan Lommin parvekkeen lämpötilan', 
        
        func: async (args, update, telegram) => {
            const data = await getTempData()
            const temp = data.data.data.temperature
            const feels = data.data.data.feels_like
            telegram.SendMessage(
                update.chat, 
                `<b>Lämpötila: </b> ${Math.round(temp * 10) / 10}°C \n<b>Tuntuu kuin: </b> ${Math.round(feels * 10) / 10}°C`, 
                { disable_notification: true, parse_mode: 'html' })
        },
    });
}