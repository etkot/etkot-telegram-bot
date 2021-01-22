const assert = require('assert');

const commands = require('../commands');

describe('Commands', function() {
    describe('Initialization', function() {
        it('No duplicate commands or aliases', function(done) {
            commands()
                .then(() => done())
                .catch(done)
        });
    });
});
