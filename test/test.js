const assert = require('assert')

const commands = require('../dist/commands').default

describe('Commands', function () {
    describe('Initialization', function () {
        it('No duplicate commands', function (done) {
            this.timeout(5000)

            commands()
                .then(() => {
                    console.log('done')
                    done()
                })
                .catch(done)
        })
    })
})
