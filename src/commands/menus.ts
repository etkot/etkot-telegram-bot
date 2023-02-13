import axios, { AxiosError } from 'axios'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { Commander } from '.'
import { Menu } from '../types/menu'

const weekDays = ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la']
dayjs.extend(isoWeek)

const fetchVersion = async () => {
    const url = `https://unisafka.fi/static/json/${dayjs().year()}/${dayjs().isoWeek()}/v.json`
    try {
        const { data } = await axios.get<{ v: number }>(url)
        return data.v
    } catch (err) {
        const error = err as AxiosError
        console.error('Version not recieved', error.response?.status, error.response?.statusText, error.config.url)
    }
}

export const fetchMenu = async (): Promise<Menu | undefined> => {
    const date = new Date()
    const version = await fetchVersion()
    const url = `https://unisafka.fi/static/json/${dayjs().year()}/${dayjs().isoWeek()}/${version}/${
        weekDays[date.getDay()]
    }.json`

    try {
        const { data } = await axios.get<Menu>(url)
        return data
    } catch (err) {
        const error = err as AxiosError
        console.error('No menus recieved', error.response?.status, error.response?.statusText, error.config.url)
    }
}

export const createMenuString = (menu: Menu, restaurantMap: { [key: string]: string }): string => {
    let menuString = ''

    for (const restaurant in restaurantMap) {
        const restaurantKey = restaurantMap[restaurant]
        const restaurantMenu = menu.restaurants_tty[restaurantKey]

        if (!restaurantMenu) {
            menuString += `<b>${restaurant.toUpperCase()}</b>:\nRIP Unisafka\n\n`
            continue
        }

        menuString += `<b>${restaurant.toUpperCase()}</b>:\n`

        const filteredMeals = restaurantMenu.meals.filter((meal) => !bannedKoks.includes(meal.kok))

        if (!filteredMeals.length) {
            menuString += `Ei menua tänään. Checkaa <a href="${restaurantMenu.rurli}">here</a>\n\n`
            continue
        }

        for (let i = 0, mealNumber = 1; i < filteredMeals.length; i++, mealNumber++) {
            const meal = filteredMeals[i]

            menuString += `\t${mealNumber}. `
            for (const item of meal.mo) {
                menuString += `${item.mpn}, `
            }
            menuString = menuString.slice(0, -2)
            menuString += '\n'
        }

        menuString += '\n'
    }
    return menuString
}

export const restaurants: { [key: string]: string } = {
    newton: 'res_newton',
    reaktori: 'res_reaktori',
    hertsi: 'res_hertsi',
    // såås: 'res_newton_soos',
    // fusari: 'res_newton_fusion',
    // iltaruoka: 'res_reaktori_iltaruoka',
    // konehuone: 'res_konehuone',
}

const bannedKoks = ['Jälkiruoka', 'Salaattiaterian proteiiniosa']

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['menus', 'food', 'ruoka'],
        arguments: ['[Restaurant name e.g. (Newton, Reaktori, Hertsi)]'],
        help: 'Kertoo päivän ravintolan menun. Jos et anna parametria, kertoo kaikkien ravintoloiden menut.',

        func: async (args, message, telegram) => {
            const menu = await fetchMenu()

            if (!menu) {
                telegram.sendMessage(message.chat.id, 'Menut ei saatavilla', { disable_notification: true })
                return
            }

            const restaurantMap = args.length ? {} : restaurants
            for (const arg of args) {
                const restaurant = arg.toLowerCase()
                if (restaurants[restaurant]) {
                    restaurantMap[restaurant] = restaurants[restaurant]
                }
            }

            if (Object.keys(restaurantMap).length === 0) {
                telegram.sendMessage(
                    message.chat.id,
                    `Valideja argumenttejä: ${Object.keys(restaurants).reduce(
                        (prev, curr) => `${prev.length ? prev + ', ' : prev}${curr}`,
                        ''
                    )}`,
                    { disable_notification: true }
                )
                return
            }

            const menuString = createMenuString(menu, restaurantMap)

            telegram.sendMessage(message.chat.id, menuString, {
                parse_mode: 'HTML',
                disable_notification: true,
                disable_web_page_preview: true,
            })
        },
    })
}
