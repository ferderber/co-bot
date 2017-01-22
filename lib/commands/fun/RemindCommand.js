const User = require('../../models/user.js');
const Commando = require('discord.js-commando');
module.exports = class RemindCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'remind',
            aliases: ['r'],
            memberName: 'remind',
            group: 'fun',
            guildOnly: true,
            description: 'Sends a reminder message to a user',
            details: 'Waits the specified amount of time before reminding a user with a message',
            examples: ['remind @Cobalt#7239 60 It\'s been 60 seconds'],
            args: [{
                    key: 'user',
                    label: 'User',
                    prompt: 'Which user do you want to lookup?',
                    type: 'user'
                },
                {
                    key: 'time',
                    label: 'Time',
                    prompt: 'When would you like to remind the user?',
                    type: 'integer'
                },
                {
                    key: 'message',
                    label: 'Message',
                    prompt: 'What is the content of the reminder?',
                    type: 'string'
                }
            ]
        });
    }
    async run(msg, args) {
        msg.reply(':ok_hand: ' + args.time + ' seconds');
        await setTimeout(() => msg.channel.sendMessage(args.user + ': ' + args.message), args.time * 1000);
    }
}