import {MessageEmbed, Message} from 'discord.js';
import WikiJS from 'wikijs';
import { Command, Argument, ArgumentType } from 'djs-cc';

export class WikiCommand extends Command {
    constructor() {
        super({
            name: 'wikipedia',
            aliases: ['wiki', 'w'],
            description: 'Looks up information from Wikipedia',
            usage: 'wiki Canada',
            args: [new Argument({
                name: 'search',
                type: ArgumentType.String,
                required: true
            })]
        });
    }
    public async run(msg: Message, args: Map<string, any>) : Promise<any> {
        let arg = args.get('search').replace(' ', '_');
        const Wiki = WikiJS();
        const data = await Wiki.search(arg, 1);
        const page = await Wiki.page(data.results[0]);

        var summary = await page.summary();
        var image = await page.mainImage();
        var info: any = await page.info();
        console.log(info);
        return Promise.all([summary, image, info]).then((arr) => {
            console.log(arr);
            var richEmbed = new MessageEmbed({
                color: 555,
                description: summary.split('\n').slice(0, 1).join('\n'),
                title: info.title,
                url: info.fullurl
            });
            if (image)
                richEmbed.setImage(image);
            msg.channel.send({
                embed: richEmbed
            });

        }).catch(err => {
            return;
        });
    }
}