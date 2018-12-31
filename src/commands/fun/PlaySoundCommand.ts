import { Sound } from '../../entity/Sound';
import { User } from '../../entity/User';
import * as path from 'path';
import * as os from 'os';
import * as ytdl from 'ytdl-core';
import { Command, Argument, ArgumentType, Client, Message } from 'djs-cc';
import { VoiceChannel, VoiceConnection, GuildMember } from 'discord.js';
import { getManager } from 'typeorm';

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
            }), new Argument({
                name: 'time',
                type: ArgumentType.Integer,
                required: false
            })]
        });
    }
    async run(msg: Message, args: Map<string, any>) {
        const manager = getManager();
        let bot = msg.client;
        let voiceChannel = msg.member.voice.channel;
        const streamOptions = {
            volume: .5
        };
        if (voiceChannel) {
            if (args.get('sound') === undefined) {
                const sound = await manager.createQueryBuilder(Sound, 'sound')
                    .orderBy('RANDOM()')
                    .limit(1)
                    .getOne();
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
                        con.play(ytdl(args.get('sound'), {
                            filter: 'audioonly',
                            begin: args.get('time') ? args.get('time') : 0 + 's'
                        }), streamOptions);
                    } catch (err) {
                        console.error(err);
                    }
                }
            } else {
                const sound = await manager.createQueryBuilder(User, 'u')
                    .where("key ILIKE :key", { key: args.get('sound')})
                    .execute();
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

    async connectToVoiceChannel(bot: Client, voiceChannel: VoiceChannel) {
        const existingConnection = bot.voiceConnections.find(con => con.channel.id === voiceChannel.id);
        if (existingConnection === null || existingConnection === undefined || existingConnection.channel.id != voiceChannel.id) {
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

    async playSound(sound: Sound, user: GuildMember, con: VoiceConnection) {
        this.incrementSoundsPlayCount(sound);
        this.incrementUsersPlayCount(user);
        try {
            return con.play(path.join(os.homedir(), 'files', sound.filename));
        } catch (err) {
            console.error(err);
        }
    }

    async incrementSoundsPlayCount(sound: Sound) {
        const manager = getManager();
        sound.playCount++;
        try {
            await manager.save(manager);
        } catch (err) {
            console.error(err);
        }
    }
    async incrementUsersPlayCount(member: GuildMember) {
        const manager = getManager();
        const user = await manager.findOne(User, member.id);
        user.soundPlays++;
        try {
            await manager.save(user);
        } catch (err) {
            console.error(err);
        }
    }
}