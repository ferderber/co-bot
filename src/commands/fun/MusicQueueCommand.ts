import {
  AudioPlayer,
  createAudioPlayer,
  joinVoiceChannel,
  createAudioResource,
} from "@discordjs/voice";
import { Argument, ArgumentType, Command, Message } from "djs-cc";
// import ytdl from "ytdl-core";
import ytdl = require("ytdl-core");

const TEN_MINUTES = 1000 * 60 * 10;

export default class MusicQueueCommand extends Command {
  private timer: NodeJS.Timeout | null = null;
  private player: AudioPlayer;
  private queue: Array<string>;

  constructor() {
    super({
      aliases: ["q", "queue"],
      args: [
        new Argument({
          name: "operation",
          required: true,
          type: ArgumentType.String,
        }),
        new Argument({
          name: "link",
          required: false,
          type: ArgumentType.String,
        }),
      ],
      description: "Queues a set of sounds / youtube links",
      name: "queue-sound",
      usage: "queue add link",
    });
    this.queue = [];
    this.player = createAudioPlayer();

    // Whenever the players state changes, check if we should play the next item in the queue
    this.player.addListener("stateChange", (_, newState) => {
      if (newState.status === "idle") {
        this.playNext();
      }
    });
  }

  private async playNext() {
    if (this.queue.length >= 1) {
      const stream = ytdl(this.queue[0], { filter: "audioonly" });
      const resource = createAudioResource(stream);
      this.player.play(resource);
    }
  }

  private async skip() {
    if (this.player) {
      this.playNext();
    }
  }

  private async pause() {
    this.player.pause();
  }

  private async resume() {
    this.player.unpause();
  }

  private async list(msg: Message) {
    if (this.queue.length <= 0) {
      msg.reply("Queue is empty");
      return;
    }
    const queueString = this.queue
      .slice(0, 3)
      .map((v, i) => `${i + 1}: ${v}`)
      .join("\n");
    msg.reply(`Next three:\n${queueString}`);
  }

  private async startQueue(msg: Message) {
    if (this.queue.length <= 0) {
      msg.reply("Queue is empty");
      return;
    }
    const voiceChannel = msg?.member?.voice?.channel;
    if (voiceChannel) {
      const con = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      const sub = con.subscribe(this.player);
      sub?.player.addListener("stateChange", (newState) => {
        if (newState.status === "idle") {
          // Clear timer if it exists
          if (this.timer) clearTimeout(this.timer);
          // Set a fresh timer so the connection is closed if not used
          this.timer = setTimeout(() => {
            sub.unsubscribe();
            sub.connection.disconnect();
          }, TEN_MINUTES);
        }
      });
      this.playNext();
    } else {
      msg.reply(
        "You must be connected to a voice channel to start a music queue"
      );
    }
  }

  public async run(msg: Message, args: Map<string, unknown>): Promise<void> {
    const operation = args.get("operation");
    switch (operation) {
      case "add":
        this.queue.push(args.get("link") as string);
        msg.reply(`Added to queue at position ${this.queue.length}`);
        break;
      case "play":
      case "join":
      case "start":
        this.startQueue(msg);
        break;
      case "list":
        this.list(msg);
        break;
      case "skip":
        this.skip();
        break;
      case "pause":
        this.pause();
        break;
      case "resume":
        this.resume();
        break;
      default:
        msg.reply("Invalid operation. Specify either `add` or `play`");
    }
  }
}
