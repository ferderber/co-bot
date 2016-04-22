"use strict";
var Command = require("../Command.js");
var Argument = require("../Argument.js");
var Sound = require('../models/sounds.js');
var mongoose = require('mongoose');
var fileManager = require('../fileManager.js');
var config = require('../../config.js');
class SoundCommand extends Command {
    constructor() {
        super('sound', ['s', 'sounds'], null);
        var args = [
            new Argument('list', ['l'], this.list),
            new Argument('add', ['a'], this.add),
            new Argument('remove', ['r', 'rm', 'rem'], this.remove),
            new Argument('info', ['i'], this.info)
        ];
        this._args = args;
    }

    list() {
        return new Promise((resolve, reject) => {
            Sound.find({}).sort({
                key: 'asc'
            }).then(sounds => {
                let msg = [];
                let k = 0;
                msg[k] = "Sounds:\n"
                for (var i in sounds) {
                    if (i % 30 == 0 && i != 0) {
                        k++;
                        msg[k] = "Sounds[" + k + "]:\n";
                    }
                    msg[k] += "Key: " + sounds[i].key +
                        ", created by: " + sounds[i].username + "\n";
                }
                resolve(msg);

            }).catch(err => reject(err));
        });
    }
    add(message, args) {
        return new Promise((resolve, reject) => {
            if (message.attachments[0]) {
                fileManager.download(message.attachments[0].url, "/files/" + message.attachments[0].filename).then(() => {
                    var sound = new Sound({
                        key: args[0],
                        filename: message.attachments[0].filename,
                        playCount: 0,
                        username: message.author.username,
                        date: new Date()
                    });

                    sound.save().then(sound => resolve("Sound added")).catch(e => {
                        if (e.code == 11000) {
                            resolve("Sound already exists");
                        }
                    });
                }).catch(err => console.error(err));
            } else {
                resolve("This command must be used in the comment of an attachment.");
            }
        });
    }
    remove(message, args) {
        return new Promise((resolve, reject) => {
            let soundExists = false;
            Sound.findOneAndRemove({
                key: args[0]
            }).then(sound => {
                if (sound) {
                    soundExists = true;
                    fileManager.remove(sound.filename).then(() => {
                        resolve(sound.key + " has been removed");
                    });
                } else {
                    resolve(args[0] + " not found");
                }
            }).catch(e => console.error(e));
        }).catch(e => console.error(e));
    }
    info(message, arg) {

    }
}
module.exports = new SoundCommand();
