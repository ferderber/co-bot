const User = require('../../models/user.js');
const {
    Command,
    Argument,
    ArgumentType
} = require('djs-cc');
const Discord = require('discord.js');

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
        }).then(async (user) => {
            if (user) {
                const guildMember = await (msg.guild.members.fetch(args.get('user').id));
                const embed = new Discord.MessageEmbed()
                    .setAuthor(guildMember.displayName, guildMember.user.displayAvatarURL())
                    .setDescription(`**Cobaltium Discord Profile**`)
                    .addField('Level', `Level: ${user.level}\nXP: ${user.xp}`, true)
                    .addField('Statistics', `Sounds Played: ${user.soundPlays}\nSounds Uploaded: ${user.sounds.length}`, true);
                msg.channel.send(embed);
            } else {
                msg.reply("User not found");
            }
        });
    }
}
