import { Message as DjsMessage } from "discord.js";
import { Argument, ArgumentType, Command, Message } from 'djs-cc';

export default class CleanCommand extends Command {
    constructor() {
        super({
            aliases: ['clean', 'clear'],
            args: [
                new Argument({
                    name: 'user',
                    required: true,
                    type: ArgumentType.User,
                }),
                new Argument({
                    default: 50,
                    name: 'numMessages',
                    required: false,
                    type: ArgumentType.Integer,
            })],
            description: 'Cleans messages from chat',
            name: 'clean-chat',
            usage: 'clean-chat @user 20',
        });
    }

    public async run(msg: Message, args: Map<string, any>): Promise<void> {
        let messages = await (await msg.channel.messages.fetch({ limit: args.get('numMessages')})).array();
        let p: Promise<any>;
        messages = messages.filter((m) => m.author.id === args.get('user').id);
        if (messages.length > 1) {
            p = msg.channel.bulkDelete(messages);
        } else if (messages.length === 1) {
            p = messages[0].delete().then(() => "Deleted one message");
        }
        let reply: DjsMessage;
        if (p) {
            await p;
            reply = await msg.reply("Deleted " + messages.length + " messages");
        } else {
            reply = await msg.reply("No messages found");
        }
        // Delete message after 10s
        setTimeout(() => reply.delete(), 10 * 1000);
    }

    public hasPermission(msg: Message): boolean {
        return msg.guild && msg.member.hasPermission('ADMINISTRATOR');
    }
}
