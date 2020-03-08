import { GuildMember, VoiceChannel, VoiceConnection } from 'discord.js';
import { Argument, ArgumentType, Client, Command, Message } from 'djs-cc';
import * as os from 'os';
import * as path from 'path';
import { getManager } from 'typeorm';
import * as ytdl from 'ytdl-core';
import { Sound } from '../../entity/Sound';
import { User } from '../../entity/User';

export default class PlaySoundCommand extends Command {
    constructor() {
        super({
            aliases: ['play', 'p'],
            args: [new Argument({
                name: 'sound',
                required: false,
                type: ArgumentType.String,
            }), new Argument({
                name: 'time',
                required: false,
                type: ArgumentType.Integer,
            })],
            description: 'Plays a sound',
            name: 'play-sound',
            usage: 'play soundname',
        });
    }
    public async run(msg: Message, args: Map<string, any>) {
        const manager = getManager();
        const bot = msg.client;
        const voiceChannel = msg.member.voice.channel;
        const streamOptions = {
            volume: 0.5,
        };
        if (voiceChannel) {
            if (args.get('sound') === undefined) {
                const sound = await manager.createQueryBuilder(Sound, 'sound')
                    .orderBy('RANDOM()')
                    .limit(1)
                    .getOne();
                if (sound) {
                    const con = await this.connectToVoiceChannel(bot, voiceChannel);
                    if (con) {
                        return this.playSound(sound, msg.member, con);
                    }
                }
            } else if (/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
                .test(args.get('sound'))) {
                const con = await this.connectToVoiceChannel(bot, voiceChannel);
                if (con) {
                    try {
                        con.play(ytdl(args.get('sound'), {
                            begin: args.get('time') ? args.get('time') : 0 + 's',
                            filter: 'audioonly',
                        }), streamOptions);
                    } catch (err) {
                        console.error(err);
                    }
                }
            } else {
                const sound = await manager.createQueryBuilder(Sound, 's')
                    .where("s.key ILIKE :key", { key: args.get('sound')})
                    .getOne();
                if (sound) {
                    const con = await this.connectToVoiceChannel(bot, voiceChannel);
                    if (con) {
                        return this.playSound(sound, msg.member, con);
                    }
                } else {
                    msg.reply("Sound not found");
                }
            }
        } else {
            msg.reply("You must be in a Voice channel to play a sound");
        }
    }

    private async connectToVoiceChannel(bot: Client, voiceChannel: VoiceChannel) {
        const existingConnection = bot.voice.connections.find((con) => con.channel.id === voiceChannel.id);
        if (existingConnection === null || existingConnection === undefined ||
            existingConnection.channel.id !== voiceChannel.id) {
            const connections = bot.voice.connections.array();
            const disconnections: void[] = [];
            connections.forEach((connection) => disconnections.push(connection.disconnect()));
            await Promise.all(disconnections);
            return await voiceChannel.join();
        } else {
            return existingConnection;
        }
    }

    private async playSound(sound: Sound, user: GuildMember, con: VoiceConnection) {
        this.incrementSoundsPlayCount(sound);
        this.incrementUsersPlayCount(user);
        try {
            return con.play(path.join(os.homedir(), 'files', sound.filename));
        } catch (err) {
            console.error(err);
        }
    }

    private async incrementSoundsPlayCount(sound: Sound) {
        const manager = getManager();
        sound.playCount++;
        try {
            await manager.save(manager);
        } catch (err) {
            console.error(err);
        }
    }
    private async incrementUsersPlayCount(member: GuildMember) {
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
