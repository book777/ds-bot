import Discord from "discord.js";

import { Client as ClientType } from "../types";

const nativeCommandParse = async (client: ClientType, interaction: Discord.Interaction<Discord.CacheType>) => {
  if (
    !(interaction.isChatInputCommand() || interaction.isCommand()) ||
    interaction.user.bot ||
    interaction.user.system
  ) {
    return;
  }

  try {
    const args = interaction.options.data.map(el => String(el.value));
    const message = await interaction.fetchReply();
    await client.commands.get(interaction.commandName)?.run(client, message, args);
  } catch (err) {
    console.error(`Error until run native command ${interaction.commandName}:`, err);
  }
};

export { nativeCommandParse };
