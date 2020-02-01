import { GuildMember, Role, VoiceChannel } from "discord.js";
import {Client} from 'djs-cc';
import { getManager } from "typeorm";
import { User } from './entity/User';

export function registerListeners(bot: Client): void {
    bot.on('message', (message) => {
        if (/^!\w+(\s+[\w"]+)+$/.test(message.content)) {
            giveExperience(message.member, 1);
        } else {
            giveExperience(message.member, 2);
        }
    });

    setInterval(() => {
        bot.guilds.forEach((guild) => {
            guild.channels.forEach((channel) => {
                if (channel.type === 'voice' && channel.id !== guild.afkChannelID) {
                    (channel as VoiceChannel).members.forEach((member) => {
                        if (member.presence.status !== 'idle') {
                            console.log('Giving ' + member.user + ' 10 xp');
                            giveExperience(member, 10);
                        }

                    });
                }
            });
        });
    }, 1000 * 60 * 30);
}

async function giveExperience(guildMember: GuildMember, xp: number): Promise<void> {
    const manager = getManager();
    let u = await manager.createQueryBuilder(User, 'u').where(guildMember.id).getOne();
    if (!u) {
        console.log("Adding user: " + guildMember.displayName);
        u = new User({id: guildMember.id, username: guildMember.user.username, xp: 0, level: 1});
    }
    u.xp += xp;
    if (u.xp >= 100) {
        u.xp = (u.xp - 100);
        u.level++;
    }
    if (u.level >= 400) {
        const member = guildMember.lastMessage.member;
        const role = member
            .guild
            .roles
            .find((r) => r.name === 'Elder');
        if (role && !member.roles.has(role.id)) {
            console.log(`Promoting ${guildMember.displayName} to Elder`);
            member.addRole(role);
        }
    }
    await manager.save(u);
}
