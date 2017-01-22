var Discord = require('discord.js');
var wiki = require('wikijs').default();
var Commando = require('discord.js-commando');
module.exports = class WikiCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'wikipedia',
            aliases: ['wiki', 'w'],
            memberName: 'wiki',
            group: 'search',
            guildOnly: true,
            description: 'Looks up information from Wikipedia',
            details: 'Looks up the Wikipedia article for a search term',
            examples: ['wiki Canada'],
            args: [{
                key: 'search',
                label: 'Search',
                prompt: 'What term would you like to search for?',
                type: 'string'
            }]
        });
    }
    async run(msg, args) {
        let arg = args.search.replace(' ', '_');
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
                var richEmbed = new Discord.RichEmbed({
                    color: 555,
                    description: arr[0].split('\n').slice(0, 1).join('\n'),
                    title: page.raw.title,
                    url: page.raw.fullurl
                });
                if (arr[1])
                    richEmbed.setImage(arr[1]);
                msg.channel.sendEmbed(richEmbed);

            });
        }).catch(err => {
            return;
        });
    }
}
