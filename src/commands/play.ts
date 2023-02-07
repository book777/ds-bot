import { GuildTextBasedChannel } from "discord.js";

import config from "../config";
import { Command } from "../types";
import { removeSimilarSongs } from "../util/remove_similar_songs";

export default {
  name: "play",
  aliases: ["p", "pl"],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const string = args.join(" ");
    if (!string) {
      return message.channel.send(`${config.emoji.error} | Please enter a song url or query to search.`);
    }

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
      // Checked by inVoiceChannel
      console.error("User is not in voice channel");
      return;
    }

    const hasQueue = !!client.distube.getQueue(message);

    await client.distube
      .play(voiceChannel, string, {
        member: message.member,
        textChannel: message.channel as GuildTextBasedChannel,
        message,
        volume: config.volume.default
      })
      .then(() => {
        if (!hasQueue) {
          const queue = client.distube.getQueue(message);
          queue?.setRepeatMode(config.repeat.default);
        }
      });

    removeSimilarSongs();

    // todo if queue.len === 0 -> config.volume.default
  }
} as Command;
