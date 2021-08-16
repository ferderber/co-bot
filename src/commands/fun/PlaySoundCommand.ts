import { GuildMember } from "discord.js";
import {
  createAudioPlayer,
  joinVoiceChannel,
  createAudioResource,
  AudioPlayer,
} from "@discordjs/voice";
import { Argument, ArgumentType, Command, Message } from "djs-cc";
import * as os from "os";
import * as path from "path";
import { getManager } from "typeorm";
import ytdl = require("ytdl-core");
import { Sound } from "../../entity/Sound";
import { User } from "../../entity/User";

export default class PlaySoundCommand extends Command {
  private player: AudioPlayer;
  constructor() {
    super({
      aliases: ["play", "p"],
      args: [
        new Argument({
          name: "sound",
          required: false,
          type: ArgumentType.String,
        }),
        new Argument({
          name: "time",
          required: false,
          type: ArgumentType.Integer,
        }),
      ],
      description: "Plays a sound",
      name: "play-sound",
      usage: "play soundname",
    });

    this.player = createAudioPlayer();
  }
  public async run(msg: Message, args: Map<string, unknown>): Promise<void> {
    const manager = getManager();
    const voiceChannel = msg?.member?.voice?.channel;
    if (voiceChannel && msg.member) {
      let sound;
      if (args.get("sound") === undefined) {
        sound = await manager
          .createQueryBuilder(Sound, "sound")
          .orderBy("RANDOM()")
          .limit(1)
          .getOne();
      } else {
        sound = await manager
          .createQueryBuilder(Sound, "s")
          .where("s.key ILIKE :key", { key: args.get("sound") })
          .getOne();
      }
      if (sound) {
        this.playSound(sound, msg.member);
      } else if (
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(
          args.get("sound") as string
        )
      ) {
        this.playStream(args.get("sound") as string, msg.member);
      } else {
        msg.reply("Sound not found");
      }
    } else {
      msg.reply("You must be in a Voice channel to play a sound");
    }
  }

  private async playSound(sound: Sound, user: GuildMember) {
    this.incrementSoundsPlayCount(sound);
    this.incrementUsersPlayCount(user);
    try {
      const voiceChannel = user?.voice?.channel;
      if (voiceChannel) {
        const con = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guildId,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        this.player.removeAllListeners("subscribe");
        con.subscribe(this.player);
        const resource = createAudioResource(
          path.join(os.homedir(), "files", sound.filename)
        );
        return this.player.play(resource);
      }
    } catch (err) {
      console.error(err);
    }
  }

  private async playStream(url: string, user: GuildMember) {
    const voiceChannel = user?.voice?.channel;
    if (voiceChannel) {
      const con = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      this.player.removeAllListeners("subscribe");
      con.subscribe(this.player);

      const stream = createAudioResource(
        ytdl(url, {
          // begin: args.get("time") ? args.get("time") : 0 + "s",
          filter: "audioonly",
        })
      );
      this.player.play(stream);
    }
  }

  private async incrementSoundsPlayCount(sound: Sound) {
    const manager = getManager();
    sound.playCount++;
    try {
      await manager.save(manager);
    } catch (err) {
      console.error(err);
    }
  }
  private async incrementUsersPlayCount(member: GuildMember) {
    const manager = getManager();
    const user = await manager.findOne(User, member.id);
    if (user) {
      user.soundPlays++;
      try {
        await manager.save(user);
      } catch (err) {
        console.error(err);
      }
    }
  }
}
