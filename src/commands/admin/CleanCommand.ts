import { Argument, ArgumentType, Command, Message } from 'djs-cc';

export class CleanCommand extends Command {
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

    public async run(msg: Message, args: Map<string, any>) {
        let messages = await msg.channel.messages.last(args.get('numMessages'));
        let p: Promise<any>;
        messages = messages.filter((m) => m.author.id === args.get('user').id);
        if (messages.length > 1) {
            p = msg.channel.bulkDelete(messages);
        } else if (messages.length === 1) {
            p = messages[0].delete().then((a) => "Deleted one message");
        }
        if (p) {
            await p;
            msg.reply("Deleted " + messages.length + " messages");
        } else {
            msg.reply("No messages found");
        }
    }

    public hasPermission(msg: Message) {
        return msg.guild && msg.member.hasPermission('ADMINISTRATOR');
    }
}
