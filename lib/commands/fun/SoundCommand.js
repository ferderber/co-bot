"use strict";
const Sound = require('../../models/sounds.js');
const mongoose = require('mongoose');
const fileManager = require('../../fileManager.js');
const config = require('../../../config.js');
const CommandClient = require('djs-cc');
const Argument = CommandClient.Argument;
const ArgumentType = CommandClient.ArgumentType;

module.exports = class SoundCommand extends CommandClient.Command {
    constructor() {
        super({
            name: 'sound',
            aliases: ['s'],
            description: 'Manages sounds',
            usage: 'sound add soundname',
            args: [new Argument({
                name: 'operation',
                type: ArgumentType.String,
                required: true,
            }), new Argument({
                name: 'sound',
                type: ArgumentType.String,
                required: true
            })]
        });
    }
    async run(msg, args) {
        if (args.get('operation') === 'add') {
            let attachment = msg.attachments.first();
            if (attachment) {
                try {
                var id = mongoose.Types.ObjectId();
                var fileType = attachment.filename.substring(attachment.filename.lastIndexOf('.'));
                return fileManager.download(attachment.url, id + fileType)
                    .then(() => {
                        var sound = new Sound({
                            _id: id,
                            key: args.get('sound'),
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
                } catch(er) {
                    console.error(er);
                }
            } else
                msg.reply("This command must be used in the comment of an attachment.");
        }
        else if (args.get('operation') === 'remove') {
            return Sound.findOneAndRemove({
                "key": {
                    $regex: new RegExp("^" + args.get('sound').toLowerCase() + "$", "i")
                }
            }).then(sound => {
                if (sound) {
                    return fileManager.remove(sound.filename).then(() => {
                        console.log("Sound " + sound.key + " removed by: " + msg.author.username);
                        msg.reply(sound.key + " has been removed");
                    });
                } else {
                    msg.reply(args.get('sound') + " not found");
                }
            }).catch(e => console.error(e));

        } else {
            msg.reply('Invalid operation! (options are: add, remove)');
        }
    }
}
