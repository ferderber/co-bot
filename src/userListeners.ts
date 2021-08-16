import { GuildMember, VoiceChannel } from "discord.js";
import { Client } from "djs-cc";
import { getManager } from "typeorm";
import { User } from "./entity/User";

export function registerListeners(bot: Client): void {
  bot.on("message", (message) => {
    if (/^!\w+(\s+[\w"]+)+$/.test(message.content) && message.member) {
      giveExperience(message.member, 1);
    } else if (message.member) {
      giveExperience(message.member, 2);
    }
  });

  setInterval(() => {
    bot.guilds.cache.forEach((guild) => {
      guild.channels.cache.forEach((channel) => {
        if (
          channel?.type === "GUILD_VOICE" &&
          channel?.id !== guild?.afkChannelId
        ) {
          (channel as VoiceChannel).members.forEach((member) => {
            if (member?.presence?.status !== "idle") {
              console.log("Giving " + member?.user + " 10 xp");
              giveExperience(member, 10);
            }
          });
        }
      });
    });
  }, 1000 * 60 * 30);
}

async function giveExperience(
  guildMember: GuildMember,
  xp: number
): Promise<void> {
  const manager = getManager();
  let u = await manager
    .createQueryBuilder(User, "u")
    .where("u.id = :id", { id: guildMember.id })
    .getOne();
  if (!u) {
    console.log("Adding user: " + guildMember.displayName);
    u = new User({
      id: guildMember.id,
      username: guildMember.user.username,
      xp: 0,
      level: 1,
    });
  }
  u.xp += xp;
  if (u.xp >= 100) {
    u.xp = u.xp - 100;
    u.level++;
  }
  if (u.level >= 400) {
    const member = guildMember;
    const role = member.guild.roles.cache.find((r) => r.name === "Elder");
    if (role && !member.roles.cache.has(role.id)) {
      console.log(`Promoting ${guildMember.displayName} to Elder`);
      member.roles.add(role);
    }
  }
  await manager.save(u);
}
