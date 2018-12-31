import { Command, Argument, ArgumentType, Message } from 'djs-cc';

export class RemindCommand extends Command {
    constructor() {
        super({
            name: 'remind',
            description: 'Sends a reminder message to a user after the specified amount of time',
            usage: 'remind @Cobalt#7239 60 It\'s been 60 seconds',
            args: [
                new Argument({
                    name: 'user',
                    type: ArgumentType.User,
                    required: true
                }),
                new Argument({
                    name: 'time',
                    type: ArgumentType.Integer,
                    required: true
                }),
                new Argument({
                    name: 'message',
                    type: ArgumentType.String,
                    required: true
                })
            ]
        });
    }
    async run(msg: Message, args: Map<string, any>) {
        await msg.reply(':ok_hand: ' + args.get('time') + ' seconds');
        await setTimeout(() => msg.channel.send(args.get('user') + ': ' + args.get('message')), args.get('time') * 1000);
    }
}