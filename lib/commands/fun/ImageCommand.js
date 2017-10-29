const Image = require('../../models/image');
const Discord = require('discord.js');
const fileManager = require('../../fileManager.js');
const mongoose = require('mongoose');
const {
    Command,
    Argument,
    ArgumentType
} = require('djs-cc');

module.exports = class ImageCommand extends Command {
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
    async run(msg, args) {
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
    async add(msg, imageName, imageUrl) {
        var url;
        if (imageUrl) {
            url = imageUrl;
        } else if (msg.attachments) {
            url = msg.attachments.first().url;
        }
        var fileType = url.substring(url.lastIndexOf('.'));
        var id = mongoose.Types.ObjectId();
        await fileManager.download(url, id + fileType)
        var img = new Image({
            _id: id,
            key: imageName,
            filename: id + fileType,
            user: msg.author.id,
            date: new Date()
        });
        img = img.save();
        msg.reply("Image added");
    }
    async remove(msg, imageName) {
        var image = await Image.findOneAndRemove({
            "key": {
                $regex: new RegExp("^" + imageName.toLowerCase() + "$", "i")
            }
        });
        if (image) {
            await fileManager.remove(image.filename);
            console.log(`Sound ${image.key} removed by: ${msg.author.username}`);
            msg.reply(`${image.key} has been removed`);
        } else {
            msg.reply(`${imageName} not found`);
        }
    }
    async display(msg, imageName) {
        var image = await Image.findOne({
            "key": {
                $regex: new RegExp("^" + imageName.toLowerCase() + "$", "i")
            }
        });
        if (image) {
            msg.delete();
            msg.channel.send(`Image requested by: ${msg.author}`, new Discord.Attachment(fileManager.getPath(image.filename)));
        } else {
            msg.reply('Image not found');
        }
    }
}