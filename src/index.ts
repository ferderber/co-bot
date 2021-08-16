import "reflect-metadata";
import { Client } from "djs-cc";
import * as path from "path";
import { createConnection } from "typeorm";
import { Config } from "./Config";
import { registerListeners } from "./userListeners";
import { Intents } from "discord.js";

const commandsPath = path.join(__dirname, "commands");

(async () => {
  try {
    createConnection();

    const client = new Client([
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
    ]);
    client
      .on("error", console.error)
      .on("warn", console.warn)
      .on("ready", () => {
        console.log(`Client ready; logged in as ${client?.user?.username}\
                #${client?.user?.discriminator} (${client?.user?.id})`);
        if (Config.env === "dev") {
          client?.user?.setPresence({
            status: "dnd",
            afk: false,
          });
        }
      })
      .on("disconnect", () => {
        console.warn("Disconnected!");
      });

    registerListeners(client);

    client.registerCommandDirectory(path.join(commandsPath, "search"));
    client.registerCommandDirectory(path.join(commandsPath, "admin"));
    client.registerCommandDirectory(path.join(commandsPath, "fun"));

    client.login(Config.discordToken);
  } catch (e) {
    console.log(e);
  }
})();
