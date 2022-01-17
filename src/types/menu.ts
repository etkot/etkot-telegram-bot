const restaurantsShort = ['tty', 'tay', 'tays', 'tamk'] as const
const restaurantsLong = ['restaurants_tty', 'restaurants_tay', 'restaurants_tays', 'restaurants_tamk'] as const

type RestaurantNames = {
    [key in typeof restaurantsShort[number]]: string[]
}

type Restaurants = {
    [key in typeof restaurantsLong[number]]: {
        [key: string]: Restaurant
    }
}

type Meal = {
    mn: string
    price: number | null
    kok: string
    mo: MealObjects[]
}

type MealObjects = {
    mpn: string
    mpd: string
}

type Restaurant = {
    restaurant: string
    open_today: boolean
    lisainfo: string | null
    eating_hours: string
    open_hours: string
    rurli: string
    meals: Meal[]
    meals_en: Meal[]
    out_of_campus: boolean
}

type Menu = {
    time_created: string
    dteksti: string
    weekday: string
    restaurants: RestaurantNames
} & Restaurants

export { Menu, Restaurant, Meal, MealObjects, RestaurantNames, Restaurants, restaurantsLong, restaurantsShort }
