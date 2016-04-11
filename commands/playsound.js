"use strict"
var Command = require("../Command.js");
var Sounds = require('../models/sounds.js');
var path = require('path');
var playSound =
    new Command('playsound', function(message) {
        let arg = this.getArg(message.content);
        let userChannel = message.author.voiceChannel;
        let bot = message.client;
        Sounds.all().then(sounds => {
            let soundExists = false;
            for (var i in sounds) {
                let sound = sounds[i];
                if (sound.key == arg) {
                    soundExists = true;
                    if (userChannel !== null && (bot.voiceConnection == null || bot.voiceConnection.voiceChannel.id != userChannel.id)) {
                        switchChannel(bot, userChannel).then(() => {
                            play(bot, sound.filename).catch(e => console.error(e));
                        }).catch(e => console.error(e));
                    } else {
                        play(bot, sound.filename).catch(e => console.error(e));
                    }
                    break;
                }
            }
            if (!soundExists)
                message.reply("Sound not found");
        });
    }, null);

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
            resolve();
        });
    });
}
module.exports = playSound;
