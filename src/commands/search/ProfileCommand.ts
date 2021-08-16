import { Message, MessageEmbed, User as DjsUser } from "discord.js";
import { Argument, ArgumentType, Command } from "djs-cc";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";

export default class ProfileCommand extends Command {
  constructor() {
    super({
      args: [
        new Argument({
          name: "user",
          required: true,
          type: ArgumentType.User,
        }),
      ],
      description: "Displays information about a user",
      name: "profile",
      usage: "profile @Cobalt#7239",
    });
  }
  public async run(msg: Message, args: Map<string, unknown>): Promise<void> {
    const repo = getRepository(User);
    const userArg = args.get("user") as DjsUser;
    const user = await repo.findOne(userArg.id);
    if (user && msg.guild) {
      const guildMember = await msg.guild.members.fetch(userArg.id);
      const embed = new MessageEmbed()
        .setAuthor(guildMember.displayName, guildMember.user.displayAvatarURL())
        .setDescription(`**Cobaltium Discord Profile**`)
        .addField("Level", `Level: ${user.level}\nXP: ${user.xp}`, true)
        .addField(
          "Statistics",
          `Sounds Played: ${user.soundPlays}\
                \nSounds Uploaded: ${user.sounds.length}`,
          true
        );
      msg.channel.send({ embeds: [embed] });
    } else {
      msg.reply("User not found");
    }
  }
}
