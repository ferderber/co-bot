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
        let voiceChannel = message.member.voiceChannel;
        let bot = message.client;
        return Sounds.findOne({
            "key": {
                $regex: new RegExp("^" + arg.toLowerCase() + "$", "i")
            }
        }).then(sound => {
            if (sound)
                if (voiceChannel !== null && (bot.voiceConnection == null || bot.voiceConnection.voiceChannel.id != userChannel.id))
                    return voiceChannel.join().then((con) => {
                        con.playFile(path.resolve(__dirname, "../../files", sound.filename));
                    }).catch(e => console.error(e));
                else
                    return this.play(bot.voiceConnections.first(), sound.filename);
            else
                return "Sound not found";
        });
    }

}
module.exports = new PlaySoundCommand();
