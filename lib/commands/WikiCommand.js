"use strict";
var Command = require("../Command.js");
var Argument = require("../Argument.js");
var Discord = require('discord.js');
var wiki = require('wikijs').default();
class WikiCommand extends Command {
    constructor() {
        super('wikipedia', ['wiki', 'w'], null);
        this.description = 'Looks up the Wikipedia article for a search term';
    }
    noArgExecute(msg) {
        let arg = this.getArg(msg.content).replace(' ', '_');
        return wiki.search(arg, 1).then((data) => {
            return wiki.page(data.results[0]);
        }).then((page) => {
            var summary = page.summary().catch((err) => {return;});
            var image = page.mainImage().catch((err) => {return;});
            var info = page.info().catch((err) => {return;});
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
                return Promise.resolve();
            });
        }).catch(err => {return;});
    }
}
module.exports = new WikiCommand();
