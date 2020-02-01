import {Message, RichEmbed} from 'discord.js';
import { Argument, ArgumentType, Command } from 'djs-cc';
import WikiJS from 'wikijs';

export default class WikiCommand extends Command {
    constructor() {
        super({
            aliases: ['wiki', 'w'],
            args: [new Argument({
                name: 'search',
                required: true,
                type: ArgumentType.String,
            })],
            description: 'Looks up information from Wikipedia',
            name: 'wikipedia',
            usage: 'wiki Canada',
        });
    }
    public async run(msg: Message, args: Map<string, any>): Promise<any> {
        const arg = args.get('search').replace(' ', '_');
        const Wiki = WikiJS();
        const data = await Wiki.search(arg, 1);
        const page = await Wiki.page(data.results[0]);
        const summary = await page.summary();
        const image = await page.mainImage();
        const info: any = await page.info();
        return Promise.all([summary, image, info]).then((arr) => {
            const richEmbed = new RichEmbed({
                color: 555,
                description: summary.split('\n').slice(0, 1).join('\n'),
                title: data.results[0],
                url: info.fullurl,
            });
            if (image) {
                richEmbed.setImage(image);
            }
            msg.channel.send({
                embed: richEmbed,
            });

        }).catch(() => {
            return;
        });
    }
}
