import { Image } from '../../entity/Image';
import { User } from '../../entity/User';
import { MessageAttachment } from 'discord.js';
import * as FileManager from '../../FileManager.js';
import { Command, Argument, ArgumentType, Message } from 'djs-cc';
import { getManager } from 'typeorm';
import { v4 } from 'uuid';

export class ImageCommand extends Command {
    constructor() {
        super({
            name: 'image',
            aliases: ['i'],
            description: 'Displays an image',
            usage: 'image imageName',
            args: [
                new Argument({
                    name: 'operationOrImageName',
                    type: ArgumentType.String,
                    required: false
                }),
                new Argument({
                    name: 'imageName',
                    type: ArgumentType.String,
                    required: false
                }),
                new Argument({
                    name: 'imageUrl',
                    type: ArgumentType.String,
                    required: false
                })
            ]
        });
    }
    async run(msg: Message, args: Map<string, any>) {
        let operationOrImage = args.get('operationOrImageName');
        let imageName = args.get('imageName');
        let imageUrl = args.get('imageUrl');

        if (operationOrImage || imageUrl || msg.attachments) {
            switch (operationOrImage) {
                case "add":
                    await this.add(msg, imageName, imageUrl);
                    break;
                case "delete":
                case "remove":
                case "del":
                    await this.remove(msg, imageName);
                    break;
                default:
                    await this.display(msg, operationOrImage);
                    break;
            }
        } else {
            msg.reply('Provide a url or attach an image');
        }
    }
    async add(msg: Message, imageName: string, imageUrl: string) {
        const manager = getManager();
        var url: string;
        var id;
        if (imageUrl) {
            url = imageUrl;
            id = v4();
        } else if (msg.attachments) {
            url = msg.attachments.first().url;
            id = msg.attachments.first().id;
        }
        var fileType = url.substring(url.lastIndexOf('.'));
        var img = new Image({
            id: id,
            key: imageName,
            filename: id + fileType,
            fileType: fileType,
            user: new User({ id: msg.author.id}),
            dateUploaded: new Date()
        });
        img = await manager.save(img);
        await FileManager.download(url, img.filename)
        msg.reply("Image added");
    }

    async remove(msg: Message, imageName: string) {
        const manager = getManager();
        const image = await manager.createQueryBuilder(Image, 'u')
            .where("key ILIKE :key", { key: imageName.toLowerCase()})
            .getOne()
        manager.remove(image);
        if (image) {
            await FileManager.remove(image.filename);
            console.log(`Image ${image.key} removed by: ${msg.author.username}`);
            msg.reply(`${image.key} has been removed`);
        } else {
            msg.reply(`${imageName} not found`);
        }
    }

    async display(msg: Message, imageName: string) {
        const manager = getManager();
        const image = await manager.createQueryBuilder(Image, 'u')
            .where("key ILIKE :key", { key: imageName.toLowerCase()})
            .getOne()
        if (image) {
            msg.delete();
            msg.channel.send(`Image requested by: ${msg.author}`, new MessageAttachment(FileManager.getPath(image.filename)));
        } else {
            msg.reply('Image not found');
        }
    }
}