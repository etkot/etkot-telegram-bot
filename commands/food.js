const { telegram } = require('../index')
const axios = require('axios')
const dayjs = require('dayjs')
const WeekOfYear = require('dayjs/plugin/weekOfYear')

const weekDays = ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la']

dayjs.extend(WeekOfYear)

const fetchMenus = async () => {
  let date = new Date()
  const url = `https://unisafka.fi/static/json/${dayjs().year()}/${dayjs().week()}/8/${weekDays[date.getDay()]}.json`
  try {
    const result = await axios.get(url)
    console.log('Got the goods')
    return result
  } catch (error) {
    console.log('No menus recieved')
  }
  return {}
}

const createMenuString = (menu) => {
  var menuString = '1 '
  var mealNumber = 1

  menu.forEach(meal => {
    meal.mo.forEach(element => {
      menuString += element.mpn
      menuString += ', '
    })
    mealNumber += 1
    menuString += `\n ${mealNumber} `
  })
  menuString = menuString.slice(0, -2)

  return menuString
}

exports.menuNewton = {
  help: 'Kertoo Newtonin menun',
  usage: '/menuNewton',
  aliases: ['menuN', 'mN', 'newton'],
  func: async (args, update) => {
    const fullmenu = await fetchMenus()
    const newtonMenu = fullmenu.data.restaurants_tty.res_newton.meals

    const menuString = createMenuString(newtonMenu)

    telegram.SendMessage(update.chat, `*Newton:* \n ${menuString}`, { parse_mode: 'Markdown', disable_notification: true})
  }
}

exports.menuHertsi = {
  help: 'Kertoo Hertsin menun',
  usage: '/menuHertsi',
  aliases: ['menuH', 'mH', 'hertsi'],
  func: async (args, update) => {
    const fullmenu = await fetchMenus()
    const hertsiMenu = fullmenu.data.restaurants_tty.res_hertsi.meals

    const menuString = createMenuString(hertsiMenu)

    telegram.SendMessage(update.chat, `*Hertsi:* \n ${menuString}`, { parse_mode: 'Markdown', disable_notification: true})
  }
}
exports.menuReaktori = {
  help: 'Kertoo Reaktorin menun',
  usage: '/menuReaktori',
  aliases: ['menuR', 'mR', 'reaktori'],
  func: async (args, update) => {
    const fullmenu = await fetchMenus()
    const reaktoriMenu = fullmenu.data.restaurants_tty.res_reaktori.meals

    var i;
    for (i = reaktoriMenu.length - 1; i >= 0; i -= 1) {
      if (reaktoriMenu[i].kok === 'Jälkiruoka' || reaktoriMenu[i].kok === 'Salaattiaterian proteiiniosa') {
        reaktoriMenu.splice(i, 1)
      }
    }

    const menuString = createMenuString(reaktoriMenu)

    telegram.SendMessage(update.chat, `*Reaktori:* \n ${menuString}`, { parse_mode: 'Markdown', disable_notification: true})
  }
}
