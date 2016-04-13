"use strict"
var redis = require('redis').createClient();
exports.add = function(key, v, createdBy, date) {
    return new Promise(function(resolve, reject) {
        var o = {
            'key': key,
            'filename': v,
            'createdBy': createdBy,
            'date': date
        };
        redis.incr('numSounds', function(err, numSounds) {
            redis.hmset(['sounds:' + numSounds,
                'id', 'sounds:' + numSounds,
                'key', key,
                'filename', v,
                'createdBy', createdBy,
                'date', date
            ], function(err, res) {
                resolve();
            });
        });
    });
}
exports.all = function() {
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
    })
}
exports.remove = function(id) {
    return new Promise((resolve, reject) => {
        redis.del(id, function(err, status) {
            if (err)
                reject(err);
            resolve(status);
        });
        //Wish this code worked :(
        // this.all().then(sounds => {
        //     let soundsLength = sounds.length;
        //     for (var i = 0; i < soundsLength; i++) {
        //         if (sounds[i].key == key) {
        //             console.log('ITS IN HERE');
        //             var filename = sounds[i].filename + "";
        //             redis.del(sounds[i].id, function(err, status) {
        //                 // if (err)
        //                 // reject(err);
        //                 console.log("FILENAME: " + filename);
        //                 console.log("Status:  " + status);
        //                 resolve(status, sounds[i]);
        //             });
        //         }
        //     }
        // });
    });
}
exports.length = function(fn) {
    //Add later
}
