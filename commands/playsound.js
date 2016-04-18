"use strict"
var Command = require("../Command.js");
var Sounds = require('../models/sounds.js');
var path = require('path');
var config = require('../config.js');
var mongoose = require('mongoose');
var playSound =
    new Command('playsound', ['ps', 'p', 'play'], function(message) {
            let arg = this.getArg(message.content);
            let userChannel = message.author.voiceChannel;
            let bot = message.client;

            Sounds.findOne({
                key: arg.toLowerCase()
            }).then(sound => {
                if (sound) {
                    if (userChannel !== null && (bot.voiceConnection == null || bot.voiceConnection.voiceChannel.id != userChannel.id)) {
                        switchChannel(bot, userChannel).then(() => {
                            play(bot, sound.filename).catch(e => console.error(e));
                        }).catch(e => console.error(e));
                    } else {
                        play(bot, sound.filename).catch(e => console.error(e));
                    }
                } else
                    message.client.sendMessage(message.channel, "Sound not found");
            }).catch(e => console.error(e));
        },
        null);

function switchChannel(bot, channel) {
    return new Promise((resolve, reject) => {
        bot.joinVoiceChannel(channel).then((conn) => {
            resolve();
        }).catch(e => console.error(e));
    });
}

function play(bot, filename) {
    filename = path.resolve(__dirname, "../files/", filename);
    return new Promise((resolve, reject) => {
        bot.voiceConnection.playFile(filename, function(err, stream) {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
module.exports = playSound;
