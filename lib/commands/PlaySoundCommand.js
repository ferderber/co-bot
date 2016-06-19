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
        let arg = this.getArg(message.content);
        let userChannel = message.sender.voiceChannel;
        let bot = message.client;
        return Sounds.findOne({
            "key": {
                $regex: new RegExp("^" + arg.toLowerCase() + "$", "i")
            }
        }).then(sound => {
            if (sound)
                if (userChannel !== null && (bot.voiceConnection == null || bot.voiceConnection.voiceChannel.id != userChannel.id))
                    return this.switchChannel(bot, userChannel).then(() => {
                        return this.play(bot, sound.filename);
                    }).catch(e => console.error(e));
                else
                    return this.play(bot, sound.filename);
            else
                return "Sound not found";
        });
    }

    switchChannel(bot, channel) {
        return bot.joinVoiceChannel(channel).catch(e => console.error(e));
    }

    play(bot, filename) {
        filename = path.resolve(__dirname, "../../files/", filename);
        return bot.voiceConnection.playFile(filename);
    }

}
module.exports = new PlaySoundCommand();
