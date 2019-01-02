import {Message, MessageEmbed} from 'discord.js';
import { Argument, ArgumentType, Command } from 'djs-cc';
import {getManager} from 'typeorm';
import {User} from '../../entity/User';

export class ProfileCommand extends Command {
    constructor() {
        super({
            args: [new Argument({
                name: 'user',
                required: true,
                type: ArgumentType.User,
            })],
            description: 'Displays information about a user',
            name: 'profile',
            usage: 'profile @Cobalt#7239',
        });
    }
    public async run(msg: Message, args: Map<string, any>) {
        const manager = getManager();
        const user = await manager.findOne(User, args.get('user').id);
        if (user) {
            const guildMember = await (msg.guild.members.fetch(args.get('user').id));
            const embed = new MessageEmbed()
                .setAuthor(guildMember.displayName, guildMember.user.displayAvatarURL())
                .setDescription(`**Cobaltium Discord Profile**`)
                .addField('Level', `Level: ${user.level}\nXP: ${user.xp}`, true)
                .addField('Statistics', `Sounds Played: ${user.soundPlays}\
                \nSounds Uploaded: ${user.sounds.length}`, true);
            msg.channel.send(embed);
        } else {
            msg.reply("User not found");
        }
    }
}
