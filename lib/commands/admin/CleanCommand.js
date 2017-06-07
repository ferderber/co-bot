const CommandClient = require('djs-cc');
const Argument = CommandClient.Argument;
const ArgumentType = CommandClient.ArgumentType;
module.exports = class CleanCommand extends CommandClient.Command {
    constructor() {
        super({
            name: 'clean-chat',
            aliases: ['clean', 'clear'],
            description: 'Cleans messages from chat',
            usage: 'clean-chat @user 20',
            args: [
                new Argument({ name: 'user', type: ArgumentType.User, required: true }),
                new Argument({ name: 'numMessages', type: ArgumentType.Integer, required: false, default: 50 })]
        });
    }
    hasPermission(msg) {
        return msg.guild && msg.member.roles.some((role) => role.hasPermission('ADMINISTRATOR'));
    }

    async run(msg, args) {
        return msg.channel.fetchMessages({
            limit: args.get('numMessages')
        }).then(messages => {
            var p;
            var messages = messages.filter((msg) => msg.author.id == args.get('user').id).array();
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
