"use strict"
var Command = require("../Command.js");
var Sounds = require('../models/sounds.js');
var path = require('path');
var config = require('../../config.js');
var mongoose = require('mongoose');

class PlaySoundCommand extends Command {
    constructor() {
        super('playsound', ['ps', 'p', 'play'], null);
        this.description = 'Plays a sound from the list of sounds (!playsound [Sound Name])';
    }
    noArgExecute(message) {
        return new Promise((resolve, reject) => {
            let arg = this.getArg(message.content);
            let userChannel = message.sender.voiceChannel;
            let bot = message.client;
            Sounds.findOne({
                "key": {
                    $regex: new RegExp("^" + arg.toLowerCase() + "$", "i")
                }
            }).then(sound => {
                if (sound)
                    if (userChannel !== null && (bot.voiceConnection == null || bot.voiceConnection.voiceChannel.id != userChannel.id))
                        this.switchChannel(bot, userChannel).then(() => {
                            this.play(bot, sound.filename).then(() => resolve()).catch(e => reject(e));
                        }).catch(e => console.error(e));
                    else
                        this.play(bot, sound.filename).then(() => resolve()).catch(e => reject(e));
                else
                    message.client.sendMessage(message.channel, "Sound not found").then(() => resolve());
            }).catch(e => reject(e));
        });
    }

    switchChannel(bot, channel) {
        return new Promise((resolve, reject) => {
            bot.joinVoiceChannel(channel).then((conn) => {
                resolve();
            }).catch(e => console.error(e));
        });
    }

    play(bot, filename) {
        filename = path.resolve(__dirname, "../../files/", filename);
        return bot.voiceConnection.playFile(filename);
    }

}
module.exports = new PlaySoundCommand();
