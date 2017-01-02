"use strict"
var Command = require("../Command.js");
var Sounds = require('../models/sounds.js');
var User = require('../models/user.js');
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
        if (voiceChannel)
            return Sounds.findOne({
                "key": {
                    $regex: new RegExp("^" + arg.toLowerCase() + "$", "i")
                }
            }).then(sound => {
                if (sound) {
                    this.incrementSoundsPlayCount(sound);
                    this.incrementUsersPlayCount(message.member);
                    if (bot.voiceConnection == null || bot.voiceConnection.voiceChannel.id != userChannel.id)
                        return voiceChannel.join().then((con) => {
                            con.playFile(path.resolve(__dirname, "../../files", sound.filename));
                        }).catch(e => console.error(e));
                    else
                        return this.play(bot.voiceConnections.first(), sound.filename);
                } else
                    return "Sound not found";
            });
        else
            return Promise.resolve();
    }
    incrementSoundsPlayCount(sound) {
        sound.playCount++;
        sound.save((err, updatedSound) => {
            if (err)
                console.error(err);
        });
    }
    incrementUsersPlayCount(member) {
        User.findOne({
            _id: member.id
        }).then((user) => {
            user.soundPlays++;
            user.save((err, updatedUser) => {
                if (err)
                    console.error(err);
            });
        });
    }

}
module.exports = new PlaySoundCommand();
