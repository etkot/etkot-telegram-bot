const { telegram } = require('../index')
const axios = require('axios')
const dayjs = require('dayjs')
const WeekOfYear = require('dayjs/plugin/weekOfYear')

const weekDays = ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la']
dayjs.extend(WeekOfYear)

const fetchVersion = async () => {
    const url = `https://unisafka.fi/static/json/${dayjs().year()}/${dayjs().week()}/v.json`
    try {
        const result = await axios.get(url)
        return result.data.v
    } catch {
        console.log('Version not recieved')
    }
    return {}
  }

const fetchMenus = async () => {
    let date = new Date()
    let version = await fetchVersion()
    //console.log(dayjs().year(), dayjs().week(), version, weekDays[date.getDay()])
    const url = `https://unisafka.fi/static/json/${dayjs().year()}/${dayjs().week()}/${version}/${weekDays[date.getDay()]}.json`
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

    menu.forEach((meal) => {
        meal.mo.forEach((element) => {
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

        telegram.SendMessage(update.chat, `<b>Newton:</b> \n ${menuString}`, {
            parse_mode: 'HTML',
            disable_notification: true,
        })
    },
}

exports.menuHertsi = {
    help: 'Kertoo Hertsin menun',
    usage: '/menuHertsi',
    aliases: ['menuH', 'mH', 'hertsi'],
    func: async (args, update) => {
        const fullmenu = await fetchMenus()
        const hertsiMenu = fullmenu.data.restaurants_tty.res_hertsi.meals

        const menuString = createMenuString(hertsiMenu)

        telegram.SendMessage(update.chat, `<b>Hertsi:</b> \n ${menuString}`, {
            parse_mode: 'HTML',
            disable_notification: true,
        })
    },
}
exports.menuReaktori = {
    help: 'Kertoo Reaktorin menun',
    usage: '/menuReaktori',
    aliases: ['menuR', 'mR', 'reaktori'],
    func: async (args, update) => {
        const fullmenu = await fetchMenus()
        const reaktoriMenu = fullmenu.data.restaurants_tty.res_reaktori.meals

        var i
        for (i = reaktoriMenu.length - 1; i >= 0; i -= 1) {
            if (reaktoriMenu[i].kok === 'Jälkiruoka' || reaktoriMenu[i].kok === 'Salaattiaterian proteiiniosa') {
                reaktoriMenu.splice(i, 1)
            }
        }

        const menuString = createMenuString(reaktoriMenu)

        telegram.SendMessage(update.chat, `<b>Reaktori:</b> \n ${menuString}`, {
            parse_mode: 'HTML',
            disable_notification: true,
        })
    },
}

exports.menu = {
    help: 'Kertoo päivän menut',
    usage: '/menus',
    aliases: ['menus', 'food', 'ruoka'],
    func: async (args, update) => {
        const fullmenu = await fetchMenus()
        const reaktoriMenu = fullmenu.data.restaurants_tty.res_reaktori.meals
        const hertsiMenu = fullmenu.data.restaurants_tty.res_hertsi.meals
        const newtonMenu = fullmenu.data.restaurants_tty.res_newton.meals

        var i
        for (i = reaktoriMenu.length - 1; i >= 0; i -= 1) {
            if (reaktoriMenu[i].kok === 'Jälkiruoka' || reaktoriMenu[i].kok === 'Salaattiaterian proteiiniosa') {
                reaktoriMenu.splice(i, 1)
            }
        }

        const menuRektoriString = createMenuString(reaktoriMenu)
        const menuHertsiString = createMenuString(hertsiMenu)
        const menuNewtonString = createMenuString(newtonMenu)

        telegram.SendMessage(
            update.chat,
            `<b>Reaktori:</b>\n ${menuRektoriString}\n<b>Newton:</b>\n ${menuNewtonString}\n<b>Hertsi:</b>\n ${menuHertsiString}`,
            { parse_mode: 'HTML', disable_notification: true }
        )
    },
}

exports.fondue = {
    help: 'Luo pollin ruokapaikan valitsemiselle',
    usage: 'fondue',
    aliases: ['foodPoll', 'fp'],
    func: (args, update) => {
        telegram.SendPoll(update.chat, 'Fondue?', ['Reaktori', 'Newton', 'Hertsi', 'Såås'], {
            disable_notification: true,
            is_anonymous: false,
        })
    },
}