var redis = require('redis').createClient();
exports.add = function(key, v, createdBy, date) {
    return new Promise(function(resolve, reject) {
        var o = {
            'key': key,
            'filename': v,
            'createdBy': createdBy,
            'date': date
        };
        redis.lpush('sounds', JSON.stringify(o));
        resolve();
    });
}
exports.all = function() {
    return new Promise(function(resolve, reject) {
        redis.lrange('sounds', 0, -1, function(err, sounds) {
            if (err)
                reject(err);
            resolve(JSON.parse("[" + sounds + "]"));
        });
    })
}
exports.delete = function(obj) {
    return new Promise((resolve, reject) => {
        redis.lrem("sounds", 0, JSON.stringify(obj), function(err, numRemoved) {
            if (err)
                reject(err);
            else
                resolve(numRemoved);
        });
    })
}
exports.length = function(fn) {
    redis.llen("sounds", function(err, size) {
        fn(err, size);
    });
}
