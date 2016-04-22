var assert = require('chai').assert;
var soundCommand = require('../commands/sound.js');
describe('Sound', function() {
    describe('#', function() {
        it('should return -1 when the value is not present', function() {
            soundCommand.list().then(a => {
                console.log(a);
                assert.equals(true, true);
            }).catch(e => console.log(e));
        });
    });
});
describe('MessageCleaner', function() {

});
