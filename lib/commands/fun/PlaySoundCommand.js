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
                required: false
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
            console.log(args.get('sound'));
            const existingConnection = bot.voiceConnections.find(con => con.channel.id === voiceChannel.id);
            if (args.get('sound') === null) {
                const count = await Sounds.count();
                const random = Math.floor(Math.random() * count);
                const sound = await Sounds.findOne().skip(random);
                if (sound) {
                    return this.playSound(bot, sound, msg.member, existingConnection);
                }
            }
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
                const sound = await Sounds.findOne({
                    "key": {
                        $regex: new RegExp("^" + args.get('sound').toLowerCase() + "$", "i")
                    }
                });
                if (sound) {
                    this.playSound(bot, sound, msg.member, existingConnection);
                } else {
                    msg.reply("Sound not found");
                }
            }
        } else {
            msg.reply("You must be in a Voice channel to play a sound");
        }
    }

    async playSound(bot, sound, user, existingConnection) {
        this.incrementSoundsPlayCount(sound);
        this.incrementUsersPlayCount(user);
        if (existingConnection === null || existingConnection.channel.id != user.voiceChannel.id) {
            try {
                const connections = bot.voiceConnections.array()
                var disconnections = [];
                for(let i = 0; i < connections.length; i++) {
                    disconnections.push(connections.disconnect());
                }
                await Promise.all(disconnections);
                const con = await user.voiceChannel.join()
                return con.playFile(path.join(os.homedir(), 'files', sound.filename));
            } catch (err) {
                console.error(err);
            }
        } else {
            return existingConnection.playFile(path.join(os.homedir(), 'files', sound.filename));
        }
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