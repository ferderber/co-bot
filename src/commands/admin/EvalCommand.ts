import { MessageEmbed } from 'discord.js';
import { Argument, ArgumentType, Command, Message } from 'djs-cc';
import safeEval from 'safe-eval';

const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e-6;

module.exports = class EvalCommand extends Command {
    constructor() {
        super({
            aliases: ['eval'],
            args: [
                new Argument({
                    name: 'code',
                    required: true,
                    type: ArgumentType.String,
            })],
            description: 'Evaluates Node.js statements.',
            name: 'eval',
            usage: 'eval `10 + 10`',
        });
    }
    public hasPermission(msg: Message) {
        return msg.guild && msg.member.hasPermission('ADMINISTRATOR');
    }

    public async run(msg: Message, args: Map<string, any>) {
        const code = args.get('code');

        const t = process.hrtime();
        const result = safeEval(code, {
            args,
            function: global['Function'],
            msg,
        });
        const diff = process.hrtime(t);
        const embed = new MessageEmbed({
            color: 555,
            description: `Result: ${result}\nEval'd in \
            ${ Math.round((diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS) / 1000 } s`,
        });
        embed.setAuthor(msg.author.username, msg.author.displayAvatarURL(), null);
        msg.channel.send(embed);
        return result;

    }
};
