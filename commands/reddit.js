const axios = require("axios")

const SendSubredditImage = (subreddit, update, telegram) => {
    axios({
        method: "GET",
        url: `https://www.reddit.com/r/${subreddit}/top/.json`,
    }).then((response) => {
        const { data } = response

        let index = Math.floor(Math.random() * 25)
        
        console.log(data.data.children[index].data.url)
        telegram
            .SendPhoto(update.chat, data.data.children[index].data.url, `${data.data.children[index].data.title}`, {
                disable_notification: true,
            })
            .catch((reason) => {
                console.log("Failed to send meme")
            })
    })
    .catch((reason) => {
        console.log("No reddit image recieved")
    })
}

const subreddits = [
    "dankmemes",
    "me_irl",
    "memes",
    "okaybuddyretard",
    "comedynecrophilia"
]

module.exports = (commander) => {
    commander.addCommand({
        commands: [ 'phmeme', 'ph', 'phm', 'ProgrammerHumor' ], 
        arguments: [],
        help: 'Lähettää top ProgrammerHumor memen', 
        
        func: (args, update, telegram) => {
            SendSubredditImage("ProgrammerHumor", update, telegram)
        },
    });

    commander.addCommand({
        commands: [ 'meme', 'm' ], 
        arguments: [],
        help: 'Lähettää top universaalin memen',

        func: (args, update, telegram) => {
            let index = Math.floor(Math.random() * subreddits.length)
            SendSubredditImage(subreddits[index], update, telegram)
        },
    });
}