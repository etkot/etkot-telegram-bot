const { help, usage } = require('./help');
const { quote, addq } = require('./quote');
const { craps } = require('./craps');

module.exports = {
    // Help
    'help': help,
    'usage': usage,

    // Quote
    'quote': quote,
    'addq': addq,
    
    // Craps
    'craps': craps,
}
