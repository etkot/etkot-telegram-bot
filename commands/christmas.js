const { telegram } = require('../index')
const dayjs = require('dayjs')
const _ = require('lodash')

const base = './images/joulukalenteri'
const endings = [
    '1.png', //1
    '1.png', //2
    '1.png', //3
    '1.png', //4
    '1.png', //5
    '1.png', //6
    '1.png', //7
    '1.png', //8
    '1.png', //9
    '1.png', //10
    '1.png', //11
    '1.png', //12
    '1.png', //13
    '1.png', //14
    '1.png', //15
    '1.png', //16
    '1.png', //17
    '1.png', //18
    '1.png', //19
    'rentoutumisluukku.jpg', //20
    '1.png', //21
    '1.png', //22
    '1.png', //23
    'insertjouluryhmäkuva.png', //24
]
var images = _.range(24).map((num) => `${base}/${endings[num]}`)

exports.christmas = {
    help: 'Avaa päivän joulukalenteriluukun',
    usage: '/christmas',
    aliases: ['ch'],
    func: (args, update) => {
        const today = dayjs()
        const christmasDay = dayjs('2020-12-25')

        if (today.get('month') !== 11) {
            telegram.SendMessage(update.chat, 'Ei nyt ole joulukuu!')
        } else if (today.format() === christmasDay.format()) {
            telegram.SendMessage(update.chat, 'Hyvää joulua!', { disable_notification: true, parse_mode: 'html' })
        } else {
            let message_id = null
            telegram.SendMessage(update.chat, 'Avataan luukkua!!').then((res) => (message_id = res.message_id))
            telegram
                .SendLocalPhoto(update.chat, images[today.get('date') - 1], `${today.get('date')}`, {
                    disable_notification: true,
                    parse_mode: 'html',
                })
                .then(() => {
                    if (message_id) {
                        telegram.DeleteMessage(update.chat, message_id)
                    }
                })
                .catch((reason) => {
                    console.log('Failed to send image')
                })
        }
    },
}
