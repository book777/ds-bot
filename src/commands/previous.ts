import config from "../config";
import { Command } from "../types";

export default {
  name: "previous",
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.channel.send(`${config.emoji.error} | There is nothing in the queue right now!`);
    const song = await queue.previous();
    message.channel.send(`${config.emoji.success} | Now playing:\n${song.name}`);
  }
} as Command;
