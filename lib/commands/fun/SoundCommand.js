"use strict";
const Sound = require('../../models/sounds.js');
const mongoose = require('mongoose');
const fileManager = require('../../fileManager.js');
const config = require('../../../config.js');
const Commando = require('discord.js-commando');
module.exports = class SoundCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'sound',
            aliases: ['sound', 's'],
            memberName: 'sound',
            group: 'fun',
            guildOnly: true,
            description: 'Manages sounds',
            details: 'Manages adding and removing sounds',
            examples: ['sound add soundname', 'sound remove soundname'],
            args: [{
                key: 'operation',
                label: 'operation',
                prompt: 'What operation do you want to perform? (add, remove)',
                type: 'string',
                validate: (value, msg) => ['add', 'remove'].some(v => value === v)
            }, {
                key: 'sound',
                label: 'name',
                prompt: 'What is the name of the sound?',
                type: 'string'
            }]
        });
    }
    async run(msg, args) {
        if (args.operation === 'add')
            if (msg.attachments.first()) {
                var id = mongoose.Types.ObjectId();
                var fileType = msg.attachments.first().filename.substring(msg.attachments.first().filename.lastIndexOf('.'));
                return fileManager.download(msg.attachments.first().url, id + fileType)
                    .then(() => {
                        var sound = new Sound({
                            _id: id,
                            key: args.sound,
                            filename: id + fileType,
                            user: msg.author.id,
                            date: new Date()
                        });
                        return sound.save().then(sound => {
                            return sound.populate('user', 'username').exec().then((sound) => {
                                console.log(sound.key + " added by: " + sound.user.username);
                                msg.reply("Sound added");
                            }).catch(err => console.error(err));
                        }).catch(e => {
                            if (e.code == 11000) {
                                fileManager.remove(id + fileType);
                                msg.reply("Sound already exists");
                            }
                        }).catch(err => console.error(err));
                    });
            } else
                msg.reply("This command must be used in the comment of an attachment.");
        else if (args.operation === 'remove') {
            return Sound.findOneAndRemove({
                "key": {
                    $regex: new RegExp("^" + args.sound.toLowerCase() + "$", "i")
                }
            }).then(sound => {
                if (sound) {
                    return fileManager.remove(sound.filename).then(() => {
                        console.log("Sound " + sound.key + " removed by: " + msg.author.username);
                        msg.reply(sound.key + " has been removed");
                    });
                } else {
                    msg.reply(args.sound + " not found");
                }
            }).catch(e => console.error(e));

        }
    }
}
