const http = require('http');
const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');
const mm = require('musicmetadata');

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
    let folderPath = getFolderPath(url);
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

exports.getMetadata = async function (file) {
    console.log(path.join(getSoundPath(), file));
    return new Promise((resolve, reject) =>
        mm(fs.createReadStream(path.join(getSoundPath(), file)), {
            duration: true
        }, (err, metadata) => {
            return err ? reject(err) : resolve(metadata);
        }));
};

function getFolderPath(url) {
    if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
        return getImagePath();
    } else if (url.match(/\.(mp3|ogg|opus|oga|flac|m4a|aac|aiff|wma|wav))$/)) {
        return getSoundPath();
    }
}

exports.getPath = function (filename) {
    return path.join(getFolderPath(filename), filename);
};

function getSoundPath() {
    return path.join(os.homedir(), 'files');
}

function getImagePath() {
    return path.join(os.homedir(), 'images');
}