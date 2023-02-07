import config from "../config";
import { Command } from "../types";

export default {
  name: "nowplaying",
  aliases: ["np"],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.channel.send(`${config.emoji.error} | There is nothing in the queue right now!`);
    const song = queue.songs[0];
    message.channel.send(`${config.emoji.play} | I'm playing **\`${song.name}\`**, by ${song.user}`);
  }
} as Command;
