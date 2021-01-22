const assert = require('assert');

const commands = require('../commands');

describe('Commands', function() {
    describe('Initialization', function() {
        it('No duplicate commands', function(done) {
            commands()
                .then(() => done())
                .catch(done)
        });
    });
});
