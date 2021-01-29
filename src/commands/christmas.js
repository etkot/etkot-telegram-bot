const dayjs = require('dayjs')
const _ = require('lodash')

const base = '../images/joulukalenteri'
const endings = [
  'nyssetulee.png', //1
  'tontutseuraa.png', //2
  'leRacoon.png', //3
  'joulusetä.png', //4
  'pussyass.png', //5
  'rosolli.png', //6
  'meetöihin.png', //7
  'booli.png', //8
  'joulius.png', //9
  'ilmapallo.png', //10
  'viinanmäärä.png', //11
  'sima.png', //12
  'eijoulua.png', //13
  'jokoonjoulu.png', //14
  'credit.png', //15
  'glog.png', //16
  'mayhem.png', //17
  'jallu.png', //18
  'ryys.png', //19
  'rentoutumisluukku.jpg', //20
  'grandtheft.png', //21
  'lahjaostos.png', //22
  'widepukki.png', //23
  'hyvääjoulua.png', //24
]
var images = _.range(24).map(num => `${base}/${endings[num]}`)

// NOTE: This will prevent the same image from being pinned multiple times
//       but will be reset if the bot is restarted (e.g. crashes or is updated).
//       Too lazy to save it somewhere on disk so this will work for now
let lastDate

module.exports = (commander) => {
  commander.addCommand({
    commands: [ 'christmas', 'ch', 'luukku' ], 
    arguments: [],
    help: 'Avaa päivän joulukalenteriluukun', 

    func: (args, update, telegram) => {
      const today = dayjs()
      const christmasDay = dayjs('2020-12-25')

      if (today.get('month') !== 11) {
        telegram.SendMessage(update.chat, 'Ei nyt ole joulukuu!')
      } else if (today.format() === christmasDay.format()) {
        telegram.SendMessage(update.chat, 'Hyvää joulua!', {
          disable_notification: true,
          parse_mode: 'html',
        })
      } else if (today.format() > christmasDay.format()) {
        telegram.SendMessage(update.chat, 'Joulu meni jo :D', {
          disable_notification: true,
          parse_mode: 'html',
        })
      } else {
        let message_id = null
        telegram
          .SendMessage(update.chat, 'Avataan luukkua!!')
          .then(res => (message_id = res.message_id))
        telegram
          .SendLocalPhoto(update.chat, images[today.get('date') - 1], `Luukku ${today.get('date')}`, {
            disable_notification: true,
            parse_mode: 'html',
          })
          .then(res => {
            if (message_id) {
              telegram.DeleteMessage(update.chat, message_id)
            }

            if (lastDate !== today.date()) {
              telegram.PinMessage(update.chat, res.result.message_id, { disable_notification: true })
            }
            lastDate = today.date()
          })
          .catch(reason => {
            console.log('Failed to send image')
          })
      }
    },
  });
}