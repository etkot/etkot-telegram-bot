const { telegram } = require('../index')
const axios = require('axios')

const getTemperature = async () => {
  let data = await axios.get('http://84.249.53.179:5002/api/parveke')
  console.log(data)
}

exports.craps = {
  help: 'Antaan Lommin parvekkeen lämpötilan',
  usage: '/temp',
  aliases: ['t', 'lomminparveke'],
  func: (args, update) => {
    getTemperature()
  },
}
