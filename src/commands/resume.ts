import config from "../config";
import { Command } from "../types";

export default {
  name: "resume",
  aliases: ["resume", "unpause"],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.channel.send(`${config.emoji.error} | There is nothing in the queue right now!`);
    if (queue.paused) {
      queue.resume();
      message.channel.send("Resumed the song for you :)");
    } else {
      message.channel.send("The queue is not paused!");
    }
  }
} as Command;
