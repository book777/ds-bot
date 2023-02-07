import config from "../config";
import { Client as ClientType } from "../types";
import { nativeCommandParse } from "./native_command_parse";

const discordHooks = (client: ClientType) => {
  client
    .on("ready", () => {
      console.log(`${client.user?.tag} is ready to play music.`);
    })
    .on("interactionCreate", interaction => nativeCommandParse(client, interaction))
    .on("messageCreate", async message => {
      if (message.author.bot || !message.guild) return;
      if (!message.content.startsWith(config.prefix)) return;

      const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift()?.toLowerCase();
      if (!command) return;

      const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command) || "");
      if (!cmd) return;
      if (cmd.inVoiceChannel && !message.member?.voice.channel) {
        message.channel.send(`${config.emoji.error} | You must be in a voice channel!`);
        return;
      }

      cmd.run(client, message, args).catch(err => {
        console.error("Command error:", err);
        message.channel.send(`${config.emoji.error} | Error: \`${err}\``);
      });
    })
    .on("voiceStateUpdate", async (_oldState, newState) => {
      // Bot not in voice
      if (client.voice.adapters.size === 0) return;
      const queue = client.distube.getQueue(newState.guild.id);
      if (!queue) return;

      const canHearUsersOnVoiceChannelWithBot = newState.guild.members.cache.filter(
        member =>
          !member.user.bot &&
          !member.voice.deaf &&
          !member.voice.serverDeaf &&
          member.voice.channelId &&
          member.voice.channelId === queue.voice.channelId
      ).size;

      if (queue.paused) {
        if (canHearUsersOnVoiceChannelWithBot !== 0) {
          queue.resume();
          // console.log(`Resume music on server ${queue.id}`)
        }
      } else {
        if (canHearUsersOnVoiceChannelWithBot === 0) {
          queue.pause(); // todo promise
          // console.log(`Pause on server ${queue.id}`)
        }
      }
    });
};

export { discordHooks };
