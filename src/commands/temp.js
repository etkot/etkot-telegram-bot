const axios = require('axios').default
const port = process.env.LOMMI_API

const getTempData = async () => {
    return axios.get(port, { timeout: 5000 })
        .then(res => res.data.data)
        .catch(err => console.error('Temperature fetch timed out'))
}

module.exports = (commander) => {
    commander.addCommand({
        commands: [ 'temp', 't', 'lomminparveke' ], 
        arguments: [],
        help: 'Antaan Lommin parvekkeen lämpötilan', 
        
        func: async (args, update, telegram) => {
            const { temperature: temp, feels_like: feels } = await getTempData() || {}

            if (temp === undefined || feels === undefined) {
                telegram.SendMessage(
                    update.chat, 
                    'Lämpötilan lukeminen ei onnistunut :(', 
                    { disable_notification: true, parse_mode: 'html' })
            }
            else {
                telegram.SendMessage(
                    update.chat, 
                    `<b>Lämpötila: </b> ${Math.round(temp * 10) / 10}°C \n<b>Tuntuu kuin: </b> ${Math.round(feels * 10) / 10}°C`, 
                    { disable_notification: true, parse_mode: 'html' })
            }
        },
    });
}