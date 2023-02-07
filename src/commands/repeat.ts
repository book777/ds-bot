import { RepeatMode } from "distube";

import config from "../config";
import { Command } from "../types";

export default {
  name: "repeat",
  aliases: ["loop", "rp"],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.channel.send(`${config.emoji.error} | There is nothing playing!`);

    if (!args.length) {
      message.channel.send(
        `${config.emoji.repeat} | There's no provided repeat values. Possible arguments: off, one, all`
      );
      return;
    }

    let mode;
    switch (args[0].toLowerCase()) {
      case "song":
      case "one":
        mode = { label: "Repeat song", value: RepeatMode.SONG };
        break;
      case "queue":
      case "all":
        mode = { label: "Repeat queue", value: RepeatMode.QUEUE };
        break;
      case "off":
      case "none":
      case "disable":
      case "disabled":
      default:
        mode = { label: "Off", value: RepeatMode.DISABLED };
        break;
    }

    queue.setRepeatMode(mode.value);
    message.channel.send(`${config.emoji.repeat} | Set repeat mode to \`${mode.label}\``);
  }
} as Command;
