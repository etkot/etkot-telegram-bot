const { telegram } = require('../index')
const axios = require('axios')
const port = process.env.LOMMI_API

const getTempData = async () => {
    let data = await axios.get(port)
    return data
}

exports.craps = {
    help: 'Antaan Lommin parvekkeen lämpötilan',
    usage: '/temp',
    aliases: ['t', 'lomminparveke'],
    func: (args, update) => {
        const data = getTempData()
        console.log(data)

        //telegram.SendMessage(update.chat, `${data}`, { disable_notification: true, parse_mode: 'html' })
    },
}
