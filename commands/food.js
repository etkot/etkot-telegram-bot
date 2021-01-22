const mongoUtil = require('../mongoUtil')
const axios = require('axios')
const CronJob = require('cron').CronJob
const dayjs = require('dayjs')
const WeekOfYear = require('dayjs/plugin/weekOfYear')

const weekDays = ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la']
dayjs.extend(WeekOfYear)

let collection = undefined
let GetCollection = () => {
    if (!collection) {
        collection = mongoUtil.getDb().collection('foods')
    }

    return collection
}

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

    menu?.forEach((meal) => {
        meal?.mo?.forEach((element) => {
            menuString += element.mpn
            menuString += ', '
        })
        mealNumber += 1
        menuString += `\n ${mealNumber} `
    })
    menuString = menuString.slice(0, -2)

    return menuString
}

const createPizzaString = (menu) => {
    var pizzaString = '1 '
    var mealNumber = 1

    menu[0]?.mo?.forEach((element) => {
        pizzaString += element.mpn
        pizzaString += ', '
        mealNumber += 1
        pizzaString += `\n ${mealNumber} `
    })
    pizzaString = pizzaString.slice(0, -2)

    return pizzaString
}

// WARNING! You are entering a manual code zone
const foodAlert = new CronJob('0 10 * * *', function () {
    GetCollection().find({}).toArray(async (err, docs) => {
        let foods = []
        for (let doc of docs) {
            foods.push(doc.food)
        }

        const fullmenu = await fetchMenus()

        let newtonFilteredFoods = []
        if (fullmenu?.data?.restaurants_tty) {
            fullmenu.data.restaurants_tty.res_newton?.meals?.forEach((meal) => {
                for (food of foods) {
                    meal.mo.forEach((item) => {
                        if (item.mpn == food) {
                            newtonFilteredFoods.push(food)
                        }
                    })
                }
            })
            let reaktoriFilteredFoods = []
            fullmenu.data.restaurants_tty.res_reaktori?.meals?.forEach((meal) => {
                for (food of foods) {
                    meal.mo.forEach((item) => {
                        if (item.mpn == food) {
                            reaktoriFilteredFoods.push(food)
                        }
                    })
                }
            })
            let hertsiFilteredFoods = []
            fullmenu.data.restaurants_tty.res_hertsi?.meals?.forEach((meal) => {
                for (food of foods) {
                    meal.mo.forEach((item) => {
                        if (item.mpn == food) {
                            hertsiFilteredFoods.push(food)
                        }
                    })
                }
            })

            let msg = 'Tarjolla olevat lempiruuat:\n'

            if (newtonFilteredFoods.length !== 0) {
                msg += `<b>Newton:</b>\n`
                for (let food of newtonFilteredFoods) {
                    msg += `  ${food},\n`
                }
            }
            if (reaktoriFilteredFoods.length !== 0) {
                msg += `<b>Reaktori:</b>\n`
                for (let food of reaktoriFilteredFoods) {
                    msg += `  ${food},\n`
                }
            }
            if (hertsiFilteredFoods.length !== 0) {
                msg += `<b>Hertsi:</b>\n`
                for (let food of hertsiFilteredFoods) {
                    msg += `  ${food},\n`
                }
            }

            if (newtonFilteredFoods.length !== 0 || reaktoriFilteredFoods.length !== 0 || hertsiFilteredFoods.length !== 0) {
                telegram.SendMessage(process.env.TG_CHAT, msg, { disable_notification: true, parse_mode: 'html' })
            }
        }
    })
})

foodAlert.start()

module.exports = (commander) => {
    commander.addCommand({
        commands: [ 'enablefoodalerts', 'efa' ], 
        arguments: [],
        help: 'Tarkistaa päivittäin onko lempiruokia saatavilla', 

        func: (args, update, telegram) => {
            foodAlert.start()
            console.log('FoodAlerts enabled')
            telegram.SendMessage(update.chat, 'FoodAlerts enabled', { disable_notification: true, parse_mode: 'html' })
        },
    });

    commander.addCommand({
        commands: [ 'disablefoodalerts', 'dfa' ], 
        arguments: [],
        help: 'Lopettaa lempiruokien tarkistamisen', 

        func: (args, update, telegram) => {
            foodAlert.stop()
            console.log('FoodAlerts disabled')
            telegram.SendMessage(update.chat, 'FoodAlerts disabled', { disable_notification: true, parse_mode: 'html' })
        },
    });

    commander.addCommand({
        commands: [ 'menunewton', 'menun', 'mn', 'newton' ], 
        arguments: [],
        help: 'Kertoo Newtonin menun', 

        func: async (args, update, telegram) => {
            const fullmenu = await fetchMenus()
            const newtonMenu = fullmenu.data?.restaurants_tty?.res_newton?.meals

            const menuString = createMenuString(newtonMenu)

            telegram.SendMessage(update.chat, `<b>Newton:</b> \n ${menuString}`, {
                parse_mode: 'HTML',
                disable_notification: true,
            })
        },
    });

    commander.addCommand({
        commands: [ 'pizza', 'pitsa', 'pistsa' ], 
        arguments: [],
        help: 'Kertoo Newtonin pizza-menun', 

        func: async (args, update, telegram) => {
            const fullmenu = await fetchMenus()
            const newtonPizza = fullmenu.data?.restaurants_tty?.res_newton_street?.meals

            const menuString = newtonPizza.length >= 1 ? createPizzaString(newtonPizza) : 'Ei ole :('

            telegram.SendMessage(update.chat, `<b>Newton Pizza:</b> \n ${menuString}`, {
                parse_mode: 'HTML',
                disable_notification: true,
            })
        },
    });

    commander.addCommand({
        commands: [ 'menuhertsi', 'menuh', 'mh', 'hertsi' ], 
        arguments: [],
        help: 'Kertoo Hertsin menun', 

        func: async (args, update, telegram) => {
            const fullmenu = await fetchMenus()
            const hertsiMenu = fullmenu.data?.restaurants_tty?.res_hertsi?.meals

            const menuString = createMenuString(hertsiMenu)

            telegram.SendMessage(update.chat, `<b>Hertsi:</b> \n ${menuString}`, {
                parse_mode: 'HTML',
                disable_notification: true,
            })
        },
    });
    
    commander.addCommand({
        commands: [ 'menureaktori', 'menur', 'mr', 'reaktori' ], 
        arguments: [],
        help: 'Kertoo Reaktorin menun',

        func: async (args, update, telegram) => {
            const fullmenu = await fetchMenus()
            const reaktoriMenu = fullmenu.data?.restaurants_tty?.res_reaktori?.meals

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
    });

    commander.addCommand({
        commands: [ 'menukonehuone', 'menuk', 'mk', 'konehuone' ], 
        arguments: [],
        help: 'Kertoo Café Konehuoneen menun',

        func: async (args, update, telegram) => {
            const fullmenu = await fetchMenus()
            
            const konehuoneMenu = fullmenu.data?.restaurants_tty?.res_konehuone?.meals

            const menuString = createMenuString(konehuoneMenu)

            telegram.SendMessage(update.chat, `<b>Konehuone:</b> \n ${menuString}`, {
                parse_mode: 'HTML',
                disable_notification: true,
            })
        },
    });

    commander.addCommand({
        commands: [ 'menus', 'food', 'ruoka' ], 
        arguments: [],
        help: 'Kertoo päivän menut',

        func: async (args, update, telegram) => {
            const fullmenu = await fetchMenus()
            const reaktoriMenu = fullmenu.data?.restaurants_tty?.res_reaktori?.meals
            const hertsiMenu = fullmenu.data?.restaurants_tty?.res_hertsi?.meals
            const newtonMenu = fullmenu.data?.restaurants_tty?.res_newton?.meals
            const newtonPizza = fullmenu.data?.restaurants_tty?.res_newton_street?.meals
            const konehuoneMenu = fullmenu.data?.restaurants_tty?.res_konehuone?.meals

            var i
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

            telegram.SendMessage(
                update.chat,
                `<b>Reaktori:</b>\n ${menuRektoriString}\n<b>Newton:</b>\n ${menuNewtonString}\n<b>Newton Pizza:</b>\n ${menuPizzaString}\n<b>Hertsi:</b>\n ${menuHertsiString}\n<b>Konehuone:</b>\n ${menuKonehuoneString}`,
                { parse_mode: 'HTML', disable_notification: true }
            )
        },
    });

    commander.addCommand({
        commands: [ 'fondue', 'foodpoll', 'fp' ], 
        arguments: [],
        help: 'Luo pollin ruokapaikan valitsemiselle',
        
        func: (args, update, telegram) => {
            telegram.SendPoll(update.chat, 'Fondue?', ['Reaktori', 'Newton', 'Hertsi', 'Såås'], {
                disable_notification: true,
                is_anonymous: false,
                allows_multiple_answers: true,
            })
        },
    });

    commander.addCommand({
        commands: [ 'addfood', 'lisääruoka', 'addf', 'af' ], 
        arguments: [],
        help: 'Lisää uuden lempiruuan',
        
        func: (args, update, telegram) => {
            if (args.length < 1) {
                helpCommands.usage.func(['addFood'], update)
                return
            }

            let food = args.join(' ')

            GetCollection().findOne({ food }, (err, result) => {
                if (result === null) {
                    GetCollection().insertOne({ food })
                    telegram.SendMessage(update.chat, `Lempiruoka lisätty`, { disable_notification: true })
                } else {
                    telegram.SendMessage(update.chat, `Lempiruoka on jo listassa`, { disable_notification: true })
                }
            })
        },
    });

    commander.addCommand({
        commands: [ 'foods', 'lempiruuat' ], 
        arguments: [],
        help: 'Listaa tallessa olevat lempiruuat',
        
        func: (args, update, telegram) => {
            GetCollection().find({}).toArray((err, docs) => {
                let msg = '<b>Lempiruuat:</b>\n'
                for (let doc of docs) {
                    msg += `  ${doc.food}\n`
                }
                telegram.SendMessage(update.chat, msg, { disable_notification: true, parse_mode: 'html' })
            })
        },
    });
}