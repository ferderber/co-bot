import { Argument, ArgumentType, Command, Message } from 'djs-cc';

import { User } from "entity/User";
import { getManager } from "typeorm";
import {Sound} from '../../entity/Sound';
import * as FileManager from '../../FileManager';

export class SoundCommand extends Command {
    constructor() {
        super({
            aliases: ['s'],
            args: [new Argument({
                name: 'operation',
                required: true,
                type: ArgumentType.String,
            }), new Argument({
                name: 'sound',
                required: true,
                type: ArgumentType.String,
            })],
            description: 'Manages sounds',
            name: 'sound',
            usage: 'sound add soundname',
        });
    }
    public async run(msg: Message, args: Map<string, any>) {
        const manager = getManager();
        if (args.get('operation') === 'add') {
            const attachment = msg.attachments.first();
            if (attachment) {
                const fileType = attachment.name.substring(attachment.name.lastIndexOf('.'));
                await FileManager.download(attachment.url, attachment.id + fileType);
                const metadata = await FileManager.getMetadata(attachment.id + fileType);
                let sound = new Sound({
                    dateUploaded: new Date(),
                    duration: metadata.format.duration,
                    fileType,
                    filename: attachment.id + fileType,
                    id: attachment.id,
                    key: args.get('sound'),
                    user: new User({id: msg.author.id}),
                });
                try {
                    sound = await manager.save(sound);
                    msg.reply("Sound added");
                } catch (e) {
                    if (e.code === 11000) {
                        FileManager.remove(sound.filename);
                        msg.reply("Sound already exists");
                    } else {
                        console.log(e);
                        throw e;
                    }
                }
            } else {
                msg.reply("This command must be used in the comment of an attachment.");
            }
        } else if (args.get('operation') === 'remove') {
            const sound = await manager.createQueryBuilder(Sound, 'u')
                .where("key ILIKE :key", { key: args.get('sound')})
                .getOne();
            manager.remove(sound);
            if (sound) {
                await FileManager.remove(sound.filename);
                console.log(`Sound ${sound.key} removed by: ${msg.author.username}`);
                msg.reply(`${sound.key} has been removed`);
            } else {
                msg.reply(`${args.get('sound')} not found`);
            }
        } else {
            msg.reply('Invalid operation! (options are: add, remove)');
        }
    }
}
