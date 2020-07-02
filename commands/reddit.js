const axios = require("axios")
const { telegram } = require("../index")

const SendSubredditImage = (subreddit, update) => {
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

exports.phmeme = {
    help: "Lähettää top ProgrammerHumor memen",
    usage: "/phmeme",
    aliases: ["ph", "phm", "ProgrammerHumor"],
    func: (args, update) => {
        SendSubredditImage("ProgrammerHumor", update)
    },
}

const subreddits = [
    "dankmemes",
    "me_irl",
    "memes",
    "okaybuddyretard",
    "comedynecrophilia"
]

exports.meme = {
    help: "Lähettää top universaalin memen",
    usage: "/meme",
    aliases: ["m"],
    func: (args, update) => {
        let index = Math.floor(Math.random() * subreddits.length)
        SendSubredditImage(subreddits[index], update)
    },
}