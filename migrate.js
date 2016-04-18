'use strict';
var config = require('./config.js');
var mongoose = require('mongoose');
var Sound = require('./models/sounds.js');
var redis = require('redis').createClient();

mongoose.connect(config.db);

//This script is for migrating from redis to mongoDB.
//Because my server had over 200 sounds, I didn't want to transfer by hand



function convertSounds(sounds) {
    var newSounds = [];
    for (var i = 0; i < sounds.length; i++) {
        newSounds[i] = new Sound({
            key: sounds[i].key,
            filename: sounds[i].filename,
            playCount: 0,
            username: sounds[i].createdBy,
            date: sounds[i].date
        });
    }
    return newSounds;
}

function getAllRedisSounds() {
    return new Promise(function(resolve, reject) {
        redis.scan(0, 'match', 'sounds:*', 'count', '300',
            function(err, res) {
                if (err)
                    reject(err);
                let multi = redis.multi();
                res[1].forEach(soundId => {
                    multi.hgetall(soundId);
                });
                multi.exec(function(err, replies) {
                    if (err)
                        reject(err);
                    resolve(replies);
                });
            });
    });
}

getAllRedisSounds().then(oldSounds => {
    let newSounds = convertSounds(oldSounds);
    for (var i = 0; i < newSounds.length; i++) {
        newSounds[i].save().then(doc => console.log(doc.key)).catch(e => {
            console.error('DUPLICATE FOUND:');
            console.error(e.errmsg);
            console.error(newSounds[i]);
        });
    }
    console.log(done);
});
