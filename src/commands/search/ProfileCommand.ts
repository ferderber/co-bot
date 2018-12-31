import {User} from '../../entity/User';
import { Command, Argument, ArgumentType } from 'djs-cc';
import {MessageEmbed, Message} from 'discord.js';
import {getManager} from 'typeorm';

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
    async run(msg: Message, args: Map<string, any>) {
        const manager = getManager();
        const user = await manager.findOne(User, args.get('user').id);
        if (user) {
            const guildMember = await (msg.guild.members.fetch(args.get('user').id));
            const embed = new MessageEmbed()
                .setAuthor(guildMember.displayName, guildMember.user.displayAvatarURL())
                .setDescription(`**Cobaltium Discord Profile**`)
                .addField('Level', `Level: ${user.level}\nXP: ${user.xp}`, true)
                .addField('Statistics', `Sounds Played: ${user.soundPlays}\nSounds Uploaded: ${user.sounds.length}`, true);
            msg.channel.send(embed);
        } else {
            msg.reply("User not found");
        }
    }
}
