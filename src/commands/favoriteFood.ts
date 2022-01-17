import { CronJob } from 'cron'
import { Commander } from '.'
import { getCollection } from '../mongoUtil'
import { Telegram } from '../telegram'
import { fetchMenu, restaurants } from './menus'

interface FoodDocument {
    food: string
}

const favoriteCheck = async (telegram: Telegram) => {
    const chat_id = process.env.TG_CHAT

    const menu = await fetchMenu()
    if (!menu || !chat_id) {
        return
    }

    const allFavorites = await getCollection<FoodDocument>('foods').find({}).toArray()
    const favorites = allFavorites.map((f) => f.food)

    const matches: { [key: string]: string[] } = {}
    for (const key in menu.restaurants_tty) {
        const restaurant = menu.restaurants_tty[key]
        const localMatches: string[] = []

        for (const meal of restaurant.meals) {
            for (const item of meal.mo) {
                const food = item.mpn.toLowerCase()
                localMatches.push(...favorites.filter((f) => food.includes(f.toLowerCase())))
            }
        }

        if (localMatches.length) {
            matches[key] = localMatches
        }
    }

    if (!Object.keys(matches).length) {
        telegram.sendMessage(chat_id, 'Ei lempiruokia tänään >:(', { disable_notification: true })
        return
    }

    const lookUpRestaurantName = (value: string) => Object.keys(restaurants).find((key) => restaurants[key] === value)

    const message = Object.keys(matches)
        .map((key) => `<b>${(lookUpRestaurantName(key) || key).toUpperCase()}</b>: ${matches[key].join(', ')}`)
        .join('\n')

    telegram.sendMessage(chat_id, `Lenmppareita tänään 😋:\n${message}`, {
        parse_mode: 'HTML',
        disable_notification: true,
    })
}

export default (commander: Commander): void => {
    commander.addInitializer((telegram) => {
        const foodAlert = new CronJob('0 9 * * *', () => favoriteCheck(telegram))
        foodAlert.start()
    })

    commander.addCommand({
        commands: ['addfood', 'lisääruoka', 'addf', 'af'],
        arguments: ['<food>'],
        help: 'Lisää uuden lempiruuan',

        func: async (args, message, telegram) => {
            const food = args.join(' ')

            try {
                await getCollection('foods').updateOne({ food }, { $set: { food } }, { upsert: true })
                telegram.sendMessage(message.chat.id, `Lempiruoka lisätty`, { disable_notification: true })
            } catch (error) {
                console.error(error)
                telegram.sendMessage(message.chat.id, `Lisäys epäonnistui :(`, { disable_notification: true })
            }
        },
    })

    commander.addCommand({
        commands: ['removefood', 'poistaruoka', 'removef', 'rf'],
        arguments: ['<food>'],
        help: 'Poistaa lempiruuan',

        func: async (args, message, telegram) => {
            const food = args.join(' ')

            try {
                await getCollection('foods').deleteOne({ food })
                telegram.sendMessage(message.chat.id, `Lempiruoka poistettu`, { disable_notification: true })
            } catch (error) {
                console.error(error)
                telegram.sendMessage(message.chat.id, `Ei tuo ole mikään lempiruoka. Hyi`, {
                    disable_notification: true,
                })
            }
        },
    })

    commander.addCommand({
        commands: ['checkfavorites', 'check', 'cf'],
        arguments: [],
        help: 'Katsoo menusta, onko lempiruokia',

        func: async (_, __, telegram) => {
            favoriteCheck(telegram)
        },
    })

    commander.addCommand({
        commands: ['foods', 'lempiruuat'],
        arguments: [],
        help: 'Listaa tallessa olevat lempiruuat',

        func: async (args, message, telegram) => {
            const allFoods = await getCollection<FoodDocument>('foods').find({}).toArray()
            let msg = '<b>Lempiruuat:</b>\n'
            for (const { food } of allFoods) {
                msg += `\t${food}\n`
            }
            telegram.sendMessage(message.chat.id, msg, { disable_notification: true, parse_mode: 'html' })
        },
    })
}
