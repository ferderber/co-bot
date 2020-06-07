import { Argument, ArgumentType, Command, Message } from 'djs-cc';

export default class RemindCommand extends Command {
    constructor() {
        super({
            args: [
                new Argument({
                    name: 'user',
                    required: true,
                    type: ArgumentType.User,
                }),
                new Argument({
                    name: 'time',
                    required: true,
                    type: ArgumentType.Integer,
                }),
                new Argument({
                    name: 'message',
                    required: true,
                    type: ArgumentType.String,
                })],
            description: 'Sends a reminder message to a user after the specified amount of time',
            name: 'remind',
            usage: 'remind @Cobalt#7239 60 It\'s been 60 seconds',
        });
    }
    public async run(msg: Message, args: Map<string, any>): Promise<void> {
        await msg.reply(':ok_hand: ' + args.get('time') + ' seconds');
        setTimeout(() =>
            msg.channel.send(args.get('user') + ': ' + args.get('message')), args.get('time') * 1000);
    }
}
