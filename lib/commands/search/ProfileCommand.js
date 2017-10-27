const User = require('../../models/user.js');
const {
    Command,
    Argument,
    ArgumentType
} = require('djs-cc');

module.exports = class ProfileCommand extends Command {
    constructor() {
        super({
            name: 'profile',
            description: 'Displays information about a user',
            usage: 'profile @Cobalt#7239',
            args: [new Argument({
                name: 'user',
                type: ArgumentType.User,
                required: true
            })]
        });
    }
    async run(msg, args) {
        return User.findOne({
            _id: args.get('user').id
        }).then(user => {
            if (user)
                msg.reply(user.username + " is level " + user.level + " with " + user.xp + " xp");
            else
                msg.reply("Username could not be found");
        });
    }
}