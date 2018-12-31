import { GuildMember, Role, VoiceChannel } from "discord.js";
import {Client} from 'djs-cc';
import {User as UserEntity} from './entity/User';
import { getManager } from "typeorm";


export function registerListeners(bot: Client): void {
    bot.on('message', (message) => {
        if (/^!\w+(\s+[\w"]+)+$/.test(message.content)) {
            giveExperience(message.member, 1);
        } else {
            giveExperience(message.member, 2);
        }
    });

    // bot.on('guildMemberAdd', (user: GuildMember) => {});

    setInterval(() => {
        bot.guilds.each((guild) => {
            guild.channels.each((channel) => {
                if (channel.type === 'voice' && channel.id !== guild.afkChannelID) {
                    (<VoiceChannel> channel).members.each(member => {
                        if (member.presence.status != 'idle') {
                            console.log('Giving ' + member.user + ' 10 xp');
                            giveExperience(member, 10);
                        }

                    });
                }

            })
        })
    }, 1000 * 60 * 30);
}

async function giveExperience(guildMember: GuildMember, xp: number) : Promise<void> {
    const manager = getManager()
    let u = await manager.findOne(UserEntity, guildMember.id);
    if (!u) {
        console.log("Adding user: " + guildMember.displayName);
        u = new UserEntity({id: guildMember.id, username: guildMember.user.username});
    }
    u.xp += xp;
    if (u.xp >= 100) {
        u.xp = (u.xp - 100);
        u.level++;
    }
    if (u.level >= 400) {
        let member = guildMember.lastMessage.member;
        let role = member
            .guild
            .roles
            .find((role: Role) => role.name === 'Elder');
        if (role && !member.roles.has(role.id)) {
            console.log(`Promoting ${guildMember.displayName} to Elder`);
            member.roles.add(role);
        }
    }
    await manager.save(u);
}
