import { Message, MessageEmbed } from "discord.js";
import { Argument, ArgumentType, Command } from "djs-cc";
import WikiJS from "wikijs";

type WInfo = {
  fullurl: string;
};

export default class WikiCommand extends Command {
  constructor() {
    super({
      aliases: ["wiki", "w"],
      args: [
        new Argument({
          name: "search",
          required: true,
          type: ArgumentType.String,
        }),
      ],
      description: "Looks up information from Wikipedia",
      name: "wikipedia",
      usage: "wiki Canada",
    });
  }
  public async run(msg: Message, args: Map<string, unknown>): Promise<void> {
    const search = args.get("search") as string;
    const arg = search.replace(" ", "_");
    const Wiki = WikiJS();
    const data = await Wiki.search(arg, 1);
    const page = await Wiki.page(data.results[0]);
    const summary = await page.summary();
    const image = await page.mainImage();
    const info = (await page.info()) as WInfo;
    return Promise.all([summary, image, info]).then(() => {
      const richEmbed = new MessageEmbed({
        color: 555,
        description: summary.split("\n").slice(0, 1).join("\n"),
        title: data.results[0],
        url: info.fullurl,
      });
      if (image) {
        richEmbed.setImage(image);
      }
      msg.channel.send({
        embeds: [richEmbed],
      });
    });
  }
}
