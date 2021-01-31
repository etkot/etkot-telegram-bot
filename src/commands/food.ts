import { getCollection } from '../mongoUtil'
import axios from 'axios'
import { CronJob } from 'cron'
import dayjs from 'dayjs'
import WeekOfYear from 'dayjs/plugin/weekOfYear'
import { Telegram } from '../telegram'
import { Commander } from '.'

const weekDays = ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la']
dayjs.extend(WeekOfYear)

const fetchVersion = async () => {
    const url = `https://unisafka.fi/static/json/${dayjs().year()}/${dayjs().week()}/v.json`
    try {
        const result = await axios.get(url)
        return result.data.v
    } catch {
        console.log('Version not recieved')
        return null
    }
}

const fetchMenus = async () => {
    const date = new Date()
    const version = await fetchVersion()
    //console.log(dayjs().year(), dayjs().week(), version, weekDays[date.getDay()])
    const url = `https://unisafka.fi/static/json/${dayjs().year()}/${dayjs().week()}/${version}/${
        weekDays[date.getDay()]
    }.json`
    try {
        const result = await axios.get(url)
        console.log('Got the goods')
        return result.data
    } catch (error) {
        console.log('No menus recieved')
        return null
    }
}

const createMenuString = (menu: any) => {
    let menuString = '1 '
    let mealNumber = 1

    menu?.forEach((meal: any) => {
        meal?.mo?.forEach((element: any) => {
            menuString += element.mpn
            menuString += ', '
        })
        mealNumber += 1
        menuString += `\n ${mealNumber} `
    })
    menuString = menuString.slice(0, -2)

    return menuString
}

const createPizzaString = (menu: any) => {
    let pizzaString = '1 '
    let mealNumber = 1

    menu[0]?.mo?.forEach((element: any) => {
        pizzaString += element.mpn
        pizzaString += ', '
        mealNumber += 1
        pizzaString += `\n ${mealNumber} `
    })
    pizzaString = pizzaString.slice(0, -2)

    return pizzaString
}

let foodAlert: CronJob
const initialize = (telegram: Telegram) => {
    // WARNING! You are entering a manual code zone
    const foodAlert = new CronJob('0 10 * * *', function () {
        getCollection('foods')
            .find({})
            .toArray(async (err, docs) => {
                const foods: string[] = []
                for (const doc of docs) {
                    foods.push(doc.food)
                }

                const fullmenu = await fetchMenus()

                const newtonFilteredFoods: string[] = []
                if (fullmenu?.data?.restaurants_tty) {
                    fullmenu.data.restaurants_tty.res_newton?.meals?.forEach((meal: any) => {
                        for (const food of foods) {
                            meal.mo.forEach((item: { mpn: string }) => {
                                if (item.mpn == food) {
                                    newtonFilteredFoods.push(food)
                                }
                            })
                        }
                    })
                    const reaktoriFilteredFoods: string[] = []
                    fullmenu.data.restaurants_tty.res_reaktori?.meals?.forEach((meal: any) => {
                        for (const food of foods) {
                            meal.mo.forEach((item: { mpn: string }) => {
                                if (item.mpn == food) {
                                    reaktoriFilteredFoods.push(food)
                                }
                            })
                        }
                    })
                    const hertsiFilteredFoods: string[] = []
                    fullmenu.data.restaurants_tty.res_hertsi?.meals?.forEach((meal: any) => {
                        for (const food of foods) {
                            meal.mo.forEach((item: { mpn: string }) => {
                                if (item.mpn == food) {
                                    hertsiFilteredFoods.push(food)
                                }
                            })
                        }
                    })

                    let msg = 'Tarjolla olevat lempiruuat:\n'

                    if (newtonFilteredFoods.length !== 0) {
                        msg += `<b>Newton:</b>\n`
                        for (const food of newtonFilteredFoods) {
                            msg += `  ${food},\n`
                        }
                    }
                    if (reaktoriFilteredFoods.length !== 0) {
                        msg += `<b>Reaktori:</b>\n`
                        for (const food of reaktoriFilteredFoods) {
                            msg += `  ${food},\n`
                        }
                    }
                    if (hertsiFilteredFoods.length !== 0) {
                        msg += `<b>Hertsi:</b>\n`
                        for (const food of hertsiFilteredFoods) {
                            msg += `  ${food},\n`
                        }
                    }

                    if (
                        newtonFilteredFoods.length !== 0 ||
                        reaktoriFilteredFoods.length !== 0 ||
                        hertsiFilteredFoods.length !== 0
                    ) {
                        if (!process.env.TG_CHAT) throw Error('No Telegram chat id')

                        telegram.sendMessage(process.env.TG_CHAT, msg, {
                            disable_notification: true,
                            parse_mode: 'html',
                        })
                    }
                }
            })
    })

    foodAlert.start()
}

export default (commander: Commander): void => {
    commander.addInitializer(initialize)

    commander.addCommand({
        commands: ['enablefoodalerts', 'efa'],
        arguments: [],
        help: 'Tarkistaa päivittäin onko lempiruokia saatavilla',

        func: (args, message, telegram) => {
            foodAlert.start()
            console.log('FoodAlerts enabled')
            telegram.sendMessage(message.chat.id, 'FoodAlerts enabled', {
                disable_notification: true,
                parse_mode: 'html',
            })
        },
    })

    commander.addCommand({
        commands: ['disablefoodalerts', 'dfa'],
        arguments: [],
        help: 'Lopettaa lempiruokien tarkistamisen',

        func: (args, message, telegram) => {
            foodAlert.stop()
            console.log('FoodAlerts disabled')
            telegram.sendMessage(message.chat.id, 'FoodAlerts disabled', {
                disable_notification: true,
                parse_mode: 'html',
            })
        },
    })

    commander.addCommand({
        commands: ['menunewton', 'menun', 'mn', 'newton'],
        arguments: [],
        help: 'Kertoo Newtonin menun',

        func: async (args, message, telegram) => {
            const fullmenu = await fetchMenus()
            const newtonMenu = fullmenu.data?.restaurants_tty?.res_newton?.meals

            const menuString = createMenuString(newtonMenu)

            telegram.sendMessage(message.chat.id, `<b>Newton:</b> \n ${menuString}`, {
                parse_mode: 'HTML',
                disable_notification: true,
            })
        },
    })

    commander.addCommand({
        commands: ['pizza', 'pitsa', 'pistsa'],
        arguments: [],
        help: 'Kertoo Newtonin pizza-menun',

        func: async (args, message, telegram) => {
            const fullmenu = await fetchMenus()
            const newtonPizza = fullmenu.data?.restaurants_tty?.res_newton_street?.meals

            const menuString = newtonPizza.length >= 1 ? createPizzaString(newtonPizza) : 'Ei ole :('

            telegram.sendMessage(message.chat.id, `<b>Newton Pizza:</b> \n ${menuString}`, {
                parse_mode: 'HTML',
                disable_notification: true,
            })
        },
    })

    commander.addCommand({
        commands: ['menuhertsi', 'menuh', 'mh', 'hertsi'],
        arguments: [],
        help: 'Kertoo Hertsin menun',

        func: async (args, message, telegram) => {
            const fullmenu = await fetchMenus()
            const hertsiMenu = fullmenu.data?.restaurants_tty?.res_hertsi?.meals

            const menuString = createMenuString(hertsiMenu)

            telegram.sendMessage(message.chat.id, `<b>Hertsi:</b> \n ${menuString}`, {
                parse_mode: 'HTML',
                disable_notification: true,
            })
        },
    })

    commander.addCommand({
        commands: ['menureaktori', 'menur', 'mr', 'reaktori'],
        arguments: [],
        help: 'Kertoo Reaktorin menun',

        func: async (args, message, telegram) => {
            const fullmenu = await fetchMenus()
            const reaktoriMenu = fullmenu.data?.restaurants_tty?.res_reaktori?.meals

            let i
            for (i = reaktoriMenu.length - 1; i >= 0; i -= 1) {
                if (reaktoriMenu[i].kok === 'Jälkiruoka' || reaktoriMenu[i].kok === 'Salaattiaterian proteiiniosa') {
                    reaktoriMenu.splice(i, 1)
                }
            }

            const menuString = createMenuString(reaktoriMenu)

            telegram.sendMessage(message.chat.id, `<b>Reaktori:</b> \n ${menuString}`, {
                parse_mode: 'HTML',
                disable_notification: true,
            })
        },
    })

    commander.addCommand({
        commands: ['menukonehuone', 'menuk', 'mk', 'konehuone'],
        arguments: [],
        help: 'Kertoo Café Konehuoneen menun',

        func: async (args, message, telegram) => {
            const fullmenu = await fetchMenus()

            const konehuoneMenu = fullmenu.data?.restaurants_tty?.res_konehuone?.meals

            const menuString = createMenuString(konehuoneMenu)

            telegram.sendMessage(message.chat.id, `<b>Konehuone:</b> \n ${menuString}`, {
                parse_mode: 'HTML',
                disable_notification: true,
            })
        },
    })

    commander.addCommand({
        commands: ['menus', 'food', 'ruoka'],
        arguments: [],
        help: 'Kertoo päivän menut',

        func: async (args, message, telegram) => {
            const fullmenu = await fetchMenus()
            const reaktoriMenu = fullmenu?.restaurants_tty?.res_reaktori?.meals
            const hertsiMenu = fullmenu?.restaurants_tty?.res_hertsi?.meals
            const newtonMenu = fullmenu?.restaurants_tty?.res_newton?.meals
            const newtonPizza = fullmenu?.restaurants_tty?.res_newton_street?.meals
            const konehuoneMenu = fullmenu?.restaurants_tty?.res_konehuone?.meals

            let i
            for (i = reaktoriMenu?.length - 1; i >= 0; i -= 1) {
                if (reaktoriMenu[i].kok === 'Jälkiruoka' || reaktoriMenu[i].kok === 'Salaattiaterian proteiiniosa') {
                    reaktoriMenu.splice(i, 1)
                }
            }

            const menuRektoriString = createMenuString(reaktoriMenu)
            const menuHertsiString = createMenuString(hertsiMenu)
            const menuNewtonString = createMenuString(newtonMenu)
            const menuPizzaString = newtonPizza?.length >= 1 ? createPizzaString(newtonPizza) : 'Ei ole :( \n'
            const menuKonehuoneString = createMenuString(konehuoneMenu)

            telegram.sendMessage(
                message.chat.id,
                `<b>Reaktori:</b>\n ${menuRektoriString}\n<b>Newton:</b>\n ${menuNewtonString}\n<b>Newton Pizza:</b>\n ${menuPizzaString}\n<b>Hertsi:</b>\n ${menuHertsiString}\n<b>Konehuone:</b>\n ${menuKonehuoneString}`,
                { parse_mode: 'HTML', disable_notification: true }
            )
        },
    })

    commander.addCommand({
        commands: ['fondue', 'foodpoll', 'fp'],
        arguments: [],
        help: 'Luo pollin ruokapaikan valitsemiselle',

        func: (args, message, telegram) => {
            telegram.sendPoll(message.chat.id, 'Fondue?', ['Reaktori', 'Newton', 'Hertsi', 'Såås'], {
                disable_notification: true,
                is_anonymous: false,
                allows_multiple_answers: true,
            })
        },
    })

    commander.addCommand({
        commands: ['addfood', 'lisääruoka', 'addf', 'af'],
        arguments: ['<food>'],
        help: 'Lisää uuden lempiruuan',

        func: (args, message, telegram) => {
            const food = args.join(' ')

            getCollection('foods').findOne({ food }, (err, result) => {
                if (result === null) {
                    getCollection('foods').insertOne({ food })
                    telegram.sendMessage(message.chat.id, `Lempiruoka lisätty`, { disable_notification: true })
                } else {
                    telegram.sendMessage(message.chat.id, `Lempiruoka on jo listassa`, { disable_notification: true })
                }
            })
        },
    })

    commander.addCommand({
        commands: ['foods', 'lempiruuat'],
        arguments: [],
        help: 'Listaa tallessa olevat lempiruuat',

        func: (args, message, telegram) => {
            getCollection('foods')
                .find({})
                .toArray((err, docs) => {
                    let msg = '<b>Lempiruuat:</b>\n'
                    for (const doc of docs) {
                        msg += `  ${doc.food}\n`
                    }
                    telegram.sendMessage(message.chat.id, msg, { disable_notification: true, parse_mode: 'html' })
                })
        },
    })
}
