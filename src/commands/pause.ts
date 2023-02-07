import config from "../config";
import { Command } from "../types";

export default {
  name: "pause",
  aliases: ["pause", "hold"],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.channel.send(`${config.emoji.error} | There is nothing in the queue right now!`);
    if (queue.paused) {
      queue.resume();
      return message.channel.send("Resumed the song for you :)");
    }
    queue.pause();
    message.channel.send("Paused the song for you :)");
  }
} as Command;
