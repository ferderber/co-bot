import { GuildMember, VoiceConnection, VoiceChannel } from 'discord.js';
import { Argument, ArgumentType, Command, Message } from 'djs-cc';
import * as os from 'os';
import * as path from 'path';
import { getManager } from 'typeorm';
import * as ytdl from 'ytdl-core';
import { Sound } from '../../entity/Sound';
import { User } from '../../entity/User';

export default class MusicQueueCommand extends Command {
    channel: VoiceChannel;
    queue: Array<string>;

    constructor() {
        super({
            aliases: ['q', 'queue'],
            args: [new Argument({name: "operation", required: true, type: ArgumentType.String}), new Argument({
                name: 'link',
                required: false,
                type: ArgumentType.String,
            })],
            description: 'Queues a set of sounds / youtube links',
            name: 'queue-sound',
            usage: 'queue soundname',
        });
        this.queue = [];
    }

    private async playNext() {
        const con = await this.channel.join();
        if (con && this.queue.length >= 1) {
            const stream = con.play(ytdl(this.queue[0], {filter: "audioonly"}));
            stream.once("finish", () => {
                this.queue.shift();
                this.playNext();
            });
        }
    }

    private async startQueue(msg: Message) {
        const voiceChannel = msg.member.voice.channel
        if (voiceChannel) {
            this.channel = voiceChannel
            this.playNext();
        } else {
            msg.reply("You must be connected to a voice channel to start a music queue");
        }
    }

    public async run(msg: Message, args: Map<string, any>): Promise<void> {
        const operation = args.get("operation");
        switch (operation) {
            case "add":
                this.queue.push(args.get("link"));
                msg.reply(`Added to queue at position ${this.queue.length}`)
                break;
            case "play":
                this.startQueue(msg);
                break;
            case "skip":
                msg.reply("Not yet implemented.")
                break;
                default:
                    msg.reply("Invalid operation. Specify either `add` or `play`")
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
