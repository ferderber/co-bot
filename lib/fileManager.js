const http = require('http');
const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');

exports.remove = function (filename) {
    return new Promise((resolve, reject) => {
        fs.exists(path.join(os.homedir(), 'files', filename), function (exists) {
            if (exists) {
                fs.unlink(path.join(os.homedir(), 'files', filename));
                resolve();
            } else {
                resolve();
            }
        });
    });
};
exports.download = function (url, dest) {
    let folderPath = path.join(os.homedir(), "files");
    return new Promise((resolve, reject) => {
        fs.lstat(folderPath, (err, stats) => {
            if (err || !stats.isDirectory()) {
                fs.mkdirSync(folderPath);
            }
            var file = fs.createWriteStream(path.join(folderPath, dest));
            console.log("Downloading: " + url);
            var responseSent = false; // flag to make sure that response is sent only once.
            var proto = http;
            if (url.indexOf("https") != -1) {
                proto = https;
            }
            proto.get(url, response => {
                response.pipe(file);
                file.on('finish', () =>
                    file.close(() => {
                        if (responseSent) return;
                        responseSent = true;
                        resolve();
                    }));
            }).on('error', err => {
                if (responseSent) return;
                responseSent = true;
                reject(err);
            });
        });
    });
};
