"use strict";
var Command = require("../Command.js");
var Sounds = require('../models/sounds.js');
var sound = new Command('sound', function(message) {
    console.log('command');
    this.doArg(message).then(msg => {
        message.reply(msg);
    });
}, new Map([
    ["list", function() {
        return new Promise((resolve, reject) => {
            Sounds.all().then((sounds) => {
                let msg = "\nSounds:\n";
                for (var i in sounds) {
                    msg += "Key: " + sounds[i].key +
                        ", filename: " + sounds[i].filename +
                        " created by: " + sounds[i].createdBy + "\n";
                }
                resolve(msg);
            }).catch(err => reject(err));
        });
    }],
    ["add", function(args, m) {
        return new Promise((resolve, reject) => {
            Sounds.add(args[0], args[1], m.author.username, new Date()).then(
                () => resolve("Sound added")).catch(
                e => console.error(e));
        });
    }],
    ["remove", function(args) {
        return new Promise((resolve, reject) => {
            Sounds.all().then(sounds => {
                let soundExists = false;
                for (var i in sounds) {
                    if (sounds[i].key == args[0]) {
                        soundExists = true;
                        Sounds.delete(sounds[i]).then(numRemoved => {
                            if (numRemoved == 1)
                                resolve(numRemoved + " sound removed");
                            else
                                resolve(numRemoved + " sounds removed");
                        }).catch(e => console.error(e));
                        break;
                    }
                }
                if (!soundExists)
                    resolve("No sound found with that name");
            });
        });
    }]
]));
module.exports = sound;
