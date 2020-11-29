const { telegram } = require('../index')
const dayjs = require('dayjs')
const _ = require('lodash')

const base = './images/joulukalenteri'
const endings = [
    'nyssetulee.png', //1
    'tontutseuraa.png', //2
    'leRacoon.png', //3
    'joulusetä.png', //4
    'pussyass.png', //5
    'rosolli.png', //6
    'meetöihin.png', //7
    'booli.png', //8
    '1.png', //9
    'grandtheft.png', //10
    'viinanmäärä.png', //11
    'sima.png', //12
    '1.png', //13
    'mayhem.png', //14
    'jokoonjoulu.png', //15
    'ilmapallo.png', //16
    '1.png', //17
    'jallu.png', //18
    '1.png', //19
    'rentoutumisluukku.jpg', //20
    '1.png', //21
    '1.png', //22
    '1.png', //23
    'widepukki.png', //24
    //'insertjouluryhmäkuva.png', //25 ?
]
var images = _.range(24).map((num) => `${base}/${endings[num]}`)

exports.christmas = {
    help: 'Avaa päivän joulukalenteriluukun',
    usage: '/christmas',
    aliases: ['ch', 'luukku'],
    func: (args, update) => {
        const today = dayjs()
        const christmasDay = dayjs('2020-12-25')

        if (today.get('month') !== 11) {
            telegram.SendMessage(update.chat, 'Ei nyt ole joulukuu!')
        } else if (today.format() === christmasDay.format()) {
            telegram.SendMessage(update.chat, 'Hyvää joulua!', { disable_notification: true, parse_mode: 'html' })
        } else if (today.format() > christmasDay.format()) {
            telegram.SendMessage(update.chat, 'Joulu meni jo :D', { disable_notification: true, parse_mode: 'html' })
        } else {
            let message_id = null
            telegram.SendMessage(update.chat, 'Avataan luukkua!!').then((res) => (message_id = res.message_id))
            telegram
                .SendLocalPhoto(update.chat, images[today.get('date') - 1], `Luukku ${today.get('date')}`, {
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
