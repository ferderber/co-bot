const User = require('../../models/user.js');
const Commando = require('discord.js-commando');
module.exports = class ProfileCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            aliases: ['profile'],
            memberName: 'profile',
            group: 'search',
            guildOnly: true,
            description: 'Displays information about a user',
            details: 'Plays a sound from the sound list',
            examples: ['profile @Cobalt#7239'],
            args: [{
                key: 'user',
                label: 'User',
                prompt: 'Which user do you want to lookup?',
                type: 'user'
            }]
        });
    }
    async run(msg, args) {
        return User.findOne({
            _id: args.user.id
        }).then(user => {
            if (user)
                msg.reply(user.username + " is level " + user.level + " with " + user.xp + " xp");
            else
                msg.reply("Username could not be found");
        });
    }
}
