import { Command } from "../types";

export default {
  name: "help",
  aliases: ["h", "cmd", "command"],
  run: async (client, message) => {
    message.channel.send({
      embeds: [
        {
          title: "Commands",
          description: client.commands.map(cmd => `\`${cmd.name}\``).join(", "),
          color: 1
        }
      ]
    });
  }
} as Command;
