var path = require('path');
const Commando = require('discord.js-commando');
module.exports = class PullChangesCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'pull-changes',
            memberName: 'pull-changes',
            group: 'admin',
            guildOnly: true,
            description: 'Updates the bot',
            details: 'Pulls the latest changes for the bot and reloads',
            examples: ['pull-changes'],
            args: [{
                key: 'confirm',
                label: 'confirm',
                prompt: 'Are you sure you want to pull changes? (type confirm)',
                type: 'string'
            }]
        });
    }
    async run(msg, args) {
        let bot = msg.client;
        if (args.confirm.includes("confirm"))
            msg.reply("fetching updates...").then((error, sentMsg) => {
                console.log("Updating pleb-bot");
                var spawn = require('child_process').spawn;
                var fetch = spawn('git', ['fetch']);
                fetch.stdout.on('data', function (data) {
                    console.log(data.toString());
                });
                fetch.on("close", function (code) {
                    var reset = spawn('git', ['reset', '--hard', 'origin/master']);
                    reset.stdout.on('data', function (data) {
                        console.log(data.toString());
                    });
                    reset.on("close", function (code) {
                        var yarn = spawn('yarn');
                        yarn.stdout.on('data', function (data) {
                            console.log(data.toString());
                        });
                        yarn.on("close", function (code) {
                            console.log("goodbye");
                            msg.channel.sendMessage("brb!").then(
                                bot.logout(() => process.exit()));
                        });
                    });
                });
            });
        else
            msg.reply("pulling changes will clear any locally made changes, type !pullchanges confirm to continue")
    }
}