const axios = require('axios');
const { telegram } = require('../index');

exports.meme = {
	help: 'Lähettää top ProgrammerHumor memen',
    usage: '/meme',
    aliases: [ 'm', 'ProgrammerHumor', 'ph' ],
    func: (args, update) => {
		axios({
			method: 'GET',
			url: 'https://www.reddit.com/r/programmerhumor/top/.json',
		}).then(response => {
			const { data } = response;

			let index = Math.floor(Math.random() * 25);
			
			console.log(data.data.children[index].data.url)
			telegram.SendPhoto(
				update.chat, data.data.children[index].data.url, 
				`${data.data.children[index].data.title}`, 
				{ disable_notification: true })
			
			.catch(reason => {
				console.log('Failed to send meme');
			})
		})
    }
}
