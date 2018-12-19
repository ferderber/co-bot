var Discord = require('discord.js');
var wiki = require('wikijs').default();
const {
    Command,
    Argument,
    ArgumentType
} = require('djs-cc');

module.exports = class WikiCommand extends Command {
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
    async run(msg, args) {
        let arg = args.get('search').replace(' ', '_');
        return wiki.search(arg, 1).then((data) => {
            return wiki.page(data.results[0]);
        }).then((page) => {
            var summary = page.summary().catch((err) => {
                return;
            });
            var image = page.mainImage().catch((err) => {
                return;
            });
            var info = page.info().catch((err) => {
                return;
            });
            return Promise.all([summary, image, info]).then((arr) => {
                var richEmbed = new Discord.MessageEmbed({
                    color: 555,
                    description: arr[0].split('\n').slice(0, 1).join('\n'),
                    title: page.raw.title,
                    url: page.raw.fullurl
                });
                if (arr[1])
                    richEmbed.setImage(arr[1]);
                msg.channel.send({
                    embed: richEmbed
                });

            });
        }).catch(err => {
            return;
        });
    }
}