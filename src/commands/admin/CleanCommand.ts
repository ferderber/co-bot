import { Message as DjsMessage, User } from "discord.js";
import { Argument, ArgumentType, Command, Message } from "djs-cc";

export default class CleanCommand extends Command {
  constructor() {
    super({
      aliases: ["clean", "clear"],
      args: [
        new Argument({
          name: "user",
          required: true,
          type: ArgumentType.User,
        }),
        new Argument({
          default: 50,
          name: "numMessages",
          required: false,
          type: ArgumentType.Integer,
        }),
      ],
      description: "Cleans messages from chat",
      name: "clean-chat",
      usage: "clean-chat @user 20",
    });
  }

  public async run(msg: Message, args: Map<string, unknown>): Promise<void> {
    let messages = await msg.channel.messages.fetch({
      limit: args.get("numMessages") as number,
    });
    const user = args.get("user") as User;
    messages = messages.filter((m) => m.author.id === user.id);
    let reply: DjsMessage;
    if (messages.size >= 1) {
      reply = await msg.reply("Deleted " + messages.size + " messages");
      await messages.forEach((msg) => msg.delete());
    } else {
      reply = await msg.reply("No messages found");
    }
    // Delete message after 10s
    setTimeout(() => reply.delete(), 10 * 1000);
  }

  public hasPermission(msg: Message): boolean {
    return (
      (msg.guild && msg?.member?.permissions.has("ADMINISTRATOR")) ?? false
    );
  }
}
