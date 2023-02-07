import { GuildTextBasedChannel } from "discord.js";

import config from "../config";
import { Command } from "../types";
import { removeSimilarSongs } from "../util/remove_similar_songs";

export default {
  name: "playskip",
  aliases: ["ps"],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const string = args.join(" ");
    if (!string) {
      return message.channel.send(`${config.emoji.error} | Please enter a song url or query to search.`);
    }

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
      console.error("User is not in voice channel");
      return;
    }

    await client.distube.play(message.member.voice.channel, string, {
      member: message.member,
      textChannel: message.channel as GuildTextBasedChannel,
      message,
      skip: true
    });
    removeSimilarSongs();
  }
} as Command;
