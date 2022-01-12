import axios from 'axios'
import { Commander } from '.'
import { Telegram } from '../telegram'
import * as TG from '../types/telegram'

const SendSubredditImage = (subreddit: string, message: TG.Message, telegram: Telegram) => {
    axios({
        method: 'GET',
        url: `https://www.reddit.com/r/${subreddit}/top/.json`,
    })
        .then((response) => {
            const { data } = response

            const index = Math.floor(Math.random() * 25)

            console.log(data.data.children[index].data.url)
            telegram
                .sendPhoto(message.chat.id, data.data.children[index].data.url, {
                    caption: `${data.data.children[index].data.title}`,
                    disable_notification: true,
                })
                .catch(() => {
                    console.log('Failed to send meme')
                })
        })
        .catch(() => {
            console.log('No reddit image recieved')
        })
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['population', 'vakiluku', 'ppl', 'vkl'],
        arguments: [],
        help: 'Kertoo suomen tämän hetkisen väkiluvun',

        func: async (_, message, telegram) => {
            const { data } = await axios.get<string>('https://dvv.fi/c/portal/render_portlet', {
                params: {
                    p_p_id: 'fi_yja_populationdisplay_web_portlet_PopulationDisplay',
                    p_l_id: 16665043,
                },
            })

            // example data: <p><span><em>Suomen</em> väkiluku</span> 5 559 548</p>
            // Find the number with regex
            const number = data.match(/\d+/g)
            if (number?.length) {
                const numberString = number.join(' ')
                telegram.sendMessage(message.chat.id, numberString, {
                    disable_notification: true,
                })
            } else {
                telegram.sendMessage(message.chat.id, 'Väkilukua ei saatu haettua', {
                    disable_notification: true,
                })
            }
        },
    })
}
