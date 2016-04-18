"use strict";
var Command = require("../Command.js");
var Sound = require('../models/sounds.js');
var mongoose = require('mongoose');
var fileManager = require('../fileManager.js');
var config = require('../config.js');
var sound = new Command('sound', ['s'], function(message) {
    this.doArg(message).then(msg => {
        if (msg instanceof Array)
            msg.forEach(m => message.client.sendMessage(message.channel, m));
        else
            message.client.sendMessage(message.channel, msg);
    }).catch(e => console.error(e));
}, new Map([
    ["list", function() {
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
    }],
    ["add", function(args, m) {
        return new Promise((resolve, reject) => {
            if (m.attachments[0]) {
                fileManager.download(m.attachments[0].url, "/files/" + m.attachments[0].filename).then(() => {
                    var sound = new Sound({
                        key: args[0],
                        filename: m.attachments[0].filename,
                        playCount: 0,
                        username: m.author.username,
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
    }],
    ["remove", function(args) {
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
    }],
    ["info", function(args) {
        return new Promise((resolve, reject) => {
            resolve("To be coded...")
        }).catch(e => console.error(e));
    }]
]));
module.exports = sound;
