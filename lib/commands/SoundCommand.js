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
            new Argument('list', "Lists all sounds", ['l'], this.list),
            new Argument('add', "Adds a sound to the list (Must be used in the Attachment comment for the sound being added)", ['a'], this.add),
            new Argument('remove', "Removes a sound from the list", ['r', 'rm', 'rem'], this.remove),
            new Argument('info', "Displays information about a sound", ['i'], this.info)
        ];
        this._args = args;
        this.description = 'Manages sounds that are playable on the server.';
    }

    list() {
        return Sound.find({}).sort({
            key: 'asc'
        }).populate('user', 'username').then(sounds => {
            let msg = [];
            let k = 0;
            msg[k] = "Sounds:\n"
            for (var i in sounds) {
                if (i % 30 == 0 && i != 0) {
                    k++;
                    msg[k] = "Sounds[" + k + "]:\n";
                }
                if (sounds[i].user)
                    msg[k] += "Key: " + sounds[i].key +
                    ", created by: " + sounds[i].user.username + "\n";
            }
            return msg;
        });
    }
    add(message, args) {
        if (message.attachments.first()) {
            var id = mongoose.Types.ObjectId();
            var fileType = message.attachments.first().filename.substring(message.attachments.first().filename.lastIndexOf('.'));
            return fileManager.download(message.attachments.first().url, "/files/" + id + fileType)
                .then(() => {
                    var sound = new Sound({
                        _id: id,
                        key: args[0],
                        filename: id + fileType,
                        user: message.author.id,
                        date: new Date()
                    });

                    return sound.save().then(sound => {
                        return sound.populate('user', 'username').exec().then((sound) => {
                            console.log(sound.key + " added by: " + sound.user.username);
                            return "Sound added";
                        }).catch(err => console.error(err));
                    }).catch(e => {
                        if (e.code == 11000) {
                            fileManager.remove(id + fileType);
                            return "Sound already exists";
                        }
                    }).catch(err => console.error(err));
                });
        } else {
            return Promise.resolve("This command must be used in the comment of an attachment.");
        }
    }
    remove(message, args) {
        return Sound.findOneAndRemove({
            "key": {
                $regex: new RegExp("^" + args[0].toLowerCase() + "$", "i")
            }
        }).then(sound => {
            if (sound) {
                return fileManager.remove(sound.filename).then(() => {
                    console.log("Sound " + sound.key + " removed by: " + message.author.username);
                    return sound.key + " has been removed";
                });
            } else {
                return args[0] + " not found";
            }
        }).catch(e => console.error(e));
    }
    info(message, arg) {

    }
}
module.exports = new SoundCommand();
