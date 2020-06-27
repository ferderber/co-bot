import { GuildMember, VoiceConnection, StreamDispatcher } from 'discord.js';
import { Argument, ArgumentType, Command, Message } from 'djs-cc';
import * as os from 'os';
import * as path from 'path';
import { getManager } from 'typeorm';
import * as ytdl from 'ytdl-core';
import { Sound } from '../../entity/Sound';
import { User } from '../../entity/User';

export default class MusicQueueCommand extends Command {
    con: VoiceConnection;
    stream: StreamDispatcher
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
            usage: 'queue add link',
        });
        this.queue = [];
    }

    private async playNext() {
        if (this.con && this.queue.length >= 1) {
            this.stream = this.con.play(ytdl(this.queue[0], {filter: "audioonly"}));
            this.stream.once("finish", () => {
                console.log("Finished");
                this.queue.shift();
                this.playNext();
            });
        }
    }

    private async skip() {
        if (this.stream) {
            this.stream.end();
        }
    }

    private async pause() {
        this.stream.pause();
    }

    private async resume() {
        this.stream.resume();
    }

    private async list(msg: Message) {
        if (this.queue.length <= 0) {
            msg.reply("Queue is empty");
            return;
        }
        const queueString = this.queue.slice(0,3).map((v, i) => `${i+1}: ${v}`).join("\n");
        msg.reply(`Next three:\n${queueString}`);
    }

    private async startQueue(msg: Message) {
        if (this.queue.length <= 0) {
            msg.reply("Queue is empty");
            return;
        }
        const voiceChannel = msg.member.voice.channel
        if (voiceChannel) {
            this.con = await voiceChannel.join();
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
            case "start":
                this.startQueue(msg);
                break;
            case "list":
                this.list(msg);
                break;
            case "skip":
                this.skip();
                break;
            case "pause":
                this.pause();
                break;
            case "resume":
                this.resume();
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
