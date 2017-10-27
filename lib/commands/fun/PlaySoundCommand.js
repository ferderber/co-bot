const Sounds = require('../../models/sounds.js');
const User = require('../../models/user.js');
const path = require('path');
const config = require('../../../config.js');
const os = require('os');
const ytdl = require('ytdl-core');
const {
    Command,
    Argument,
    ArgumentType
} = require('djs-cc');

module.exports = class PlaySoundCommand extends Command {
    constructor() {
        super({
            name: 'play-sound',
            aliases: ['play', 'p'],
            description: 'Plays a sound',
            usage: 'play soundname',
            args: [new Argument({
                name: 'sound',
                type: ArgumentType.String,
                required: true
            })]
        });
    }
    async run(msg, args) {
        let bot = msg.client;
        let voiceChannel = msg.member.voiceChannel;
        const streamOptions = {
            volume: .5
        };
        if (voiceChannel) {
            const existingConnection = bot.voiceConnections.find(con => con.channel.id === voiceChannel.id);
            if (/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(args.get('sound'))) {
                if (existingConnection === null || existingConnection.channel.id != voiceChannel.id) {
                    bot.voiceConnections.every((con) => con.disconnect());
                    return voiceChannel.join().then((con) => {
                        con.playStream(ytdl(args.get('sound'), {
                            filter: 'audioonly'
                        }), streamOptions);
                    });
                } else {
                    return existingConnection.playStream(ytdl(args.get('sound'), {
                        filter: 'audioonly'
                    }), streamOptions);
                }
            } else {
                await Sounds.findOne({
                    "key": {
                        $regex: new RegExp("^" + args.get('sound').toLowerCase() + "$", "i")
                    }
                }).then(sound => {
                    if (sound) {
                        this.incrementSoundsPlayCount(sound);
                        this.incrementUsersPlayCount(msg.member);
                        if (existingConnection === null || existingConnection.channel.id != voiceChannel.id) {
                            bot.voiceConnections.every((con) => con.disconnect());
                            return voiceChannel.join().then((con) => {
                                con.playFile(path.join(os.homedir(), 'files', sound.filename));
                            }).catch(e => console.error(e));
                        } else
                            return existingConnection.playFile(path.join(os.homedir(), 'files', sound.filename));
                    } else
                        msg.reply("Sound not found");
                });
            }
        } else
            msg.reply("You must be in a Voice channel to play a sound");
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