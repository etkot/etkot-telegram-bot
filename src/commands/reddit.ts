import axios from 'axios'
import { Commander } from '.'
import { TG } from '../types/telegram'
import { Telegram } from '../telegram'

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

const subreddits = ['dankmemes', 'me_irl', 'memes', 'okaybuddyretard', 'comedynecrophilia']

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['phmeme', 'ph', 'phm', 'ProgrammerHumor'],
        arguments: [],
        help: 'Lähettää top ProgrammerHumor memen',

        func: (args, message, telegram) => {
            SendSubredditImage('ProgrammerHumor', message, telegram)
        },
    })

    commander.addCommand({
        commands: ['meme', 'm'],
        arguments: [],
        help: 'Lähettää top universaalin memen',

        func: (args, message, telegram) => {
            const index = Math.floor(Math.random() * subreddits.length)
            SendSubredditImage(subreddits[index], message, telegram)
        },
    })
}
