"use strict";
var Command = require("../Command.js");
var Sounds = require('../models/sounds.js');
var fileManager = require('../fileManager.js');
var sound = new Command('sound', function(message) {
    this.doArg(message).then(msg => {
        if (msg instanceof Array)
            msg.forEach(m => message.client.sendMessage(message.channel, m));
        else
            message.client.sendMessage(message.channel, msg);
    });
}, new Map([
    ["list", function() {
        return new Promise((resolve, reject) => {
            Sounds.all().then((sounds) => {
                console.log(this);
                let msg = [];
                let k = 0;
                msg[k] = "Sounds:\n"
                for (var i in sounds) {
                    if (i % 30 == 0 && i != 0) {
                        k++;
                        msg[k] = "Sounds[" + k + "]:\n";
                    }
                    msg[k] += "Key: " + sounds[i].key +
                        ", created by: " + sounds[i].createdBy + "\n";
                }
                resolve(msg);
            }).catch(err => reject(err));
        });
    }],
    ["add", function(args, m) {
        return new Promise((resolve, reject) => {
            if (m.attachments[0]) {
                fileManager.download(m.attachments[0].url, "/files/" + m.attachments[0].filename).then(() => {
                    m.client.sendMessage(m.channel, "Download complete");
                    Sounds.add(args[0], m.attachments[0].filename, m.author.username, new Date()).then(
                        () => resolve("Sound added")).catch(
                        e => console.error(e));
                }).catch(err => console.error(err));
            } else if (args[1]) {
                Sounds.add(args[0], args[1], m.author.username, new Date()).then(
                    () => resolve("Sound added")).catch(
                    e => console.error(e));
            }
        });
    }],
    ["remove", function(args) {
        return new Promise((resolve, reject) => {
            Sounds.all().then((sounds) => {
                let soundExists = false;
                sounds.forEach(sound => {
                    if (sound.key == args[0]) {
                        soundExists = true;
                        fileManager.remove(sound.filename).then(() => {
                            Sounds.remove(sound.id).then((numDeleted) => {
                                resolve(sound.key + " has been removed");
                            });
                        });
                    }
                });
                if (!soundExists)
                    resolve(sound.key + " wasn't found");
            });
        });
    }]
]));
module.exports = sound;
