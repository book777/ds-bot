import config from "../config";
import { Command } from "../types";

export default {
  name: "stop",
  aliases: ["disconnect", "leave", "st"],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message);
    if (!queue) {
      return message.channel.send(`${config.emoji.error} | There is nothing in the queue right now!`);
    }

    await queue.stop();
    message.channel.send(`${config.emoji.success} | Stopped!`);
  }
} as Command;
