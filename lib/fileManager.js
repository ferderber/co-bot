var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');

exports.remove = function(filename) {
    return new Promise((resolve, reject) => {
        fs.exists(__dirname + "/../files/" + filename, function(exists) {
            if (exists) {
                fs.unlink(__dirname + '/../files/' + filename);
                resolve();
            } else {
                console.log(filename + ' not found');
                resolve();
            }
        });
    });
};
exports.download = function(url, dest) {
    var file = fs.createWriteStream(__dirname + "/../" + dest);
    console.log("Downloading: " + url);
    return new Promise((resolve, reject) => {
        var responseSent = false; // flag to make sure that response is sent only once.
        var proto = http;
        if (url.indexOf("https") != -1) {
            proto = https;
        }
        proto.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    if (responseSent) return;
                    responseSent = true;
                    resolve();
                });
            });
        }).on('error', err => {
            if (responseSent) return;
            responseSent = true;
            console.log(err);
            reject(err);
        });
    });
};
