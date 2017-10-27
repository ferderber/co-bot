var path = require('path');
const {
    Command,
    Argument,
    ArgumentType
} = require('djs-cc');
module.exports = class PullChangesCommand extends Command {
    constructor() {
        super({
            name: 'pull-changes',
            description: 'Updates the bot',
            usage: 'pull-changes',
            args: [new Argument({
                name: 'confirm',
                type: ArgumentType.String
            })]
        });
    }

    hasPermission(msg) {
        return msg.guild && msg.member.roles.some((role) => role.hasPermission('ADMINISTRATOR'));
    }

    async run(msg, args) {
        let bot = msg.client;
        if (args.get('confirm').includes("confirm"))
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
                            msg.channel.send("brb!").then(() => {
                                bot.destroy();
                                process.exit()
                            });
                        });
                    });
                });
            });
        else
            msg.reply("pulling changes will clear any locally made changes, type !pullchanges confirm to continue")
    }
}