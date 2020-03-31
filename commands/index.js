const { help, usage } = require('./help');
const { quote, addq } = require('./quote');
const { craps } = require('./craps');
const { minecraft } = require('./minecraft');

module.exports = {
    // Help
    help, usage,

    // Quote
    quote, addq,
    
    // Craps
    craps,

    // Minecraft
    minecraft,
}
