const {
    Command,
    Argument,
    ArgumentType
} = require('djs-cc');
var Discord = require('discord.js');
const safeEval = require('safe-eval');

const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e-6;

module.exports = class EvalCommand extends Command {
    constructor() {
        super({
            name: 'eval',
            aliases: ['eval'],
            description: 'Evaluates Node.js statements.',
            usage: '!eval `10 + 10`',
            args: [
                new Argument({
                    name: 'code',
                    type: ArgumentType.String,
                    required: true
                })
            ]
        });
    }
    hasPermission(msg) {
        return msg.guild && msg.member.hasPermission('ADMINISTRATOR');
    }

    async run(msg, args) {
        const code = args.get('code');

        var t = process.hrtime();
        const result = safeEval(code, {msg, args, for: global['for'], var: global['var'], 'function': global['function']});
        var diff = process.hrtime(t);
        var richEmbed = new Discord.MessageEmbed({
            color: 555,
            description: `Result: ${result}\nEval'd in ${ Math.round((diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS) / 1000 } s`,
        });
        richEmbed.setAuthor(msg.author.username, msg.author.displayAvatarURL, null);
        msg.channel.send(richEmbed);
        return result;

    }
}