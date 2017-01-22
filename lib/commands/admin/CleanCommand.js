const Commando = require('discord.js-commando');
module.exports = class CleanCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'clean-chat',
            aliases: ['clean', 'clear'],
            memberName: 'clear',
            group: 'admin',
            guildOnly: true,
            description: 'Cleans messages from chat',
            details: 'Used to delete recent message history',
            examples: ['clean-chat @user 20', 'clean-chat command'],
            args: [{
                key: 'user',
                label: 'user',
                prompt: 'Which user will the command apply to? (@username)',
                type: 'user'
            }, {
                key: 'numMessages',
                label: 'Number of Messages',
                min: 5,
                max: 50,
                prompt: 'How many lines should I clear?',
                type: 'integer'
            }]
        });
    }
    hasPermission(msg) {
        return msg.guild && msg.member.roles.some((role) => role.hasPermission('ADMINISTRATOR'));
    }

    async run(msg, args) {
        return msg.channel.fetchMessages({
            limit: args.numMessages
        }).then(messages => {
            var p;
            var messages = messages.filter((msg) => msg.author.id == args.user.id).array();
            console.log(messages.length);
            if (messages.length > 1)
                p = msg.channel.bulkDelete(messages);
            else if (messages.length === 1)
                p = messages[0].delete().then((a) => "Deleted one message");
            if (p)
                p.then(msg.reply("Deleted " + messages.length + " messages"));
            else
                msg.reply("No messages found");
        }).catch(err => console.error(err));
    }
}
