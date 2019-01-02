import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as mm from 'music-metadata';
import * as os from 'os';
import * as path from 'path';

export function download(url: string, dest: string) {
    const folderPath = getFolderPath(url);
    return new Promise((resolve, reject) => {
        fs.lstat(folderPath, (err, stats) => {
            if (err || !stats.isDirectory()) {
                fs.mkdirSync(folderPath);
            }
            const file = fs.createWriteStream(path.join(folderPath, dest));
            console.log("Downloading: " + url);
            let responseSent = false; // flag to make sure that response is sent only once.
            const fn = (response: http.IncomingMessage) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    if (responseSent) {
                        return;
                    }
                    responseSent = true;
                    resolve();
                });
            };
            if (url.indexOf("https") === -1) {
                http.get(url, fn)
                    .on('error', (e) => {
                        if (responseSent) {
                            return;
                        }
                        responseSent = true;
                        reject(e);
                    });
            }

            https.get(url, fn)
                .on('error', (e) => {
                    if (responseSent) {
                        return;
                    }
                    responseSent = true;
                    reject(e);
                });
        });
    });
}

export function remove(filename: string) {
    return new Promise((resolve, reject) => {
        fs.exists(path.join(os.homedir(), 'files', filename), (exists) => {
            if (exists) {
                fs.unlink(path.join(os.homedir(), 'files', filename), resolve);
            } else {
                resolve();
            }
        });
    });
}

export async function getMetadata(file: string): Promise<mm.IAudioMetadata> {
    console.log(path.join(getSoundPath(), file));
    const metadata = await mm.parseFile(path.join(getSoundPath(), file), {
        duration: true });
    return metadata;
}

export function getFolderPath(url: string) {
    if (url.match(/\.(jpeg|jpg|gif|png|gifv|mp4|webm)$/) != null) {
        return getImagePath();
    } else if (url.match(/\.(mp3|ogg|opus|oga|flac|m4a|aac|aiff|wma|wav)$/)) {
        return getSoundPath();
    }
}

export function getPath(filename: string) {
    return path.join(getFolderPath(filename), filename);
}

function getSoundPath() {
    return path.join(os.homedir(), 'files');
}

function getImagePath() {
    return path.join(os.homedir(), 'images');
}
