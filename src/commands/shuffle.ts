import config from "../config";
import { Command } from "../types";

export default {
  name: "shuffle",
  aliases: ["sh", "rand", "random"],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.channel.send(`${config.emoji.error} | There is nothing in the queue right now!`);
    await queue.shuffle();
    message.channel.send("Shuffled songs in the queue");
  }
} as Command;
