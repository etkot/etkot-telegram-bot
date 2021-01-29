const axios = require('axios')
const port = process.env.LOMMI_API

const getTempData = async () => {
    let res = await axios.get(port)
    return res.data.data;
}

module.exports = (commander) => {
    commander.addCommand({
        commands: [ 'temp', 't', 'lomminparveke' ], 
        arguments: [],
        help: 'Antaan Lommin parvekkeen lämpötilan', 
        
        func: async (args, update, telegram) => {
            const { temperature: temp, feels_like: feels } = await getTempData()
            telegram.SendMessage(
                update.chat, 
                `<b>Lämpötila: </b> ${Math.round(temp * 10) / 10}°C \n<b>Tuntuu kuin: </b> ${Math.round(feels * 10) / 10}°C`, 
                { disable_notification: true, parse_mode: 'html' })
        },
    });
}