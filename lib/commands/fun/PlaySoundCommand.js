const Sounds = require('../../models/sounds.js');
const User = require('../../models/user.js');
const path = require('path');
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
            if (args.get('sound') === undefined) {
                const count = await Sounds.count();
                const random = Math.floor(Math.random() * count);
                const sound = await Sounds.findOne().skip(random);
                if (sound) {
                    let con = await this.connectToVoiceChannel(bot, voiceChannel);
                    if (con) {
                        return this.playSound(sound, msg.member, con);
                    }
                }
            } 
            else if (/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(args.get('sound'))) {
                let con = await this.connectToVoiceChannel(bot, voiceChannel);
                if (con) {
                    try {
                        con.playStream(ytdl(args.get('sound'), {
                            filter: 'audioonly'
                        }), streamOptions);
                    } catch (err) {
                        console.error(err);
                    }
                }
            } else {
                const sound = await Sounds.findOne({
                    "key": {
                        $regex: new RegExp("^" + args.get('sound').toLowerCase() + "$", "i")
                    }
                });
                if (sound) {
                    let con = await this.connectToVoiceChannel(bot, voiceChannel);
                    if (con) {
                        this.playSound(sound, msg.member, con);
                    }
                } else {
                    msg.reply("Sound not found");
                }
            }
        } else {
            msg.reply("You must be in a Voice channel to play a sound");
        }
    }

    async connectToVoiceChannel(bot, voiceChannel) {
        const existingConnection = bot.voiceConnections.find(con => con.channel.id === voiceChannel.id);
        if (existingConnection === null || existingConnection.channel.id != voiceChannel.id) {
            const connections = bot.voiceConnections.array();
            var disconnections = [];
            for(let i = 0; i < connections.length; i++) {
                disconnections.push(connections[i].disconnect());
            }
            await Promise.all(disconnections);
            return await voiceChannel.join();
        } else {
            return existingConnection;
        }
    }

    async playSound(sound, user, con) {
        this.incrementSoundsPlayCount(sound);
        this.incrementUsersPlayCount(user);
        try {
            return con.playFile(path.join(os.homedir(), 'files', sound.filename));
        } catch (err) {
            console.error(err);
        }
    }

    async incrementSoundsPlayCount(sound) {
        sound.playCount++;
        try {
            await sound.save();
        } catch (err) {
            console.error(err);
        }
    }
    async incrementUsersPlayCount(member) {
        const user = await User.findOne({
            _id: member.id
        });
        user.soundPlays++;
        try {
            await user.save();
        } catch (err) {
            console.error(err);
        }
    }
}