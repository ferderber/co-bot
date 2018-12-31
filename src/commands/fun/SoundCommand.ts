import { Command, Argument, ArgumentType, Message } from 'djs-cc';

import {Sound} from '../../entity/Sound';
import { User } from "entity/User";
import { getManager } from "typeorm";
import * as FileManager from '../../FileManager';

module.exports = class SoundCommand extends Command {
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
    async run(msg: Message, args: Map<string, any>) {
        const manager = getManager();
        if (args.get('operation') === 'add') {
            let attachment = msg.attachments.first();
            if (attachment) {
                var fileType = attachment.name.substring(attachment.name.lastIndexOf('.'));
                await FileManager.download(attachment.url, attachment.id + fileType);
                const metadata = await FileManager.getMetadata(attachment.id + fileType);
                var sound = new Sound({
                    key: args.get('sound'),
                    fileType: fileType,
                    filename: attachment.id + fileType,
                    id: attachment.id,
                    user: new User({id: msg.author.id}),
                    dateUploaded: new Date(),
                    duration: metadata.format.duration
                });
                try {
                    sound = await manager.save(sound);
                    msg.reply("Sound added");
                } catch (e) {
                    if (e.code == 11000) {
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
            let sound = await manager.createQueryBuilder(Sound, 'u')
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