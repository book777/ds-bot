import Discord from 'discord.js'
import { DisTube } from 'distube'

export type Command = {
  name: string;
  aliases?: string[];
  inVoiceChannel?: boolean;
  // eslint-disable-next-line no-use-before-define
  run: (client: Client, message: Discord.Message, args: string[]) => Promise<void>;
}

export interface Client extends Discord.Client {
  distube: DisTube;
  commands: Discord.Collection<string, Command>;
  aliases: Discord.Collection<string, string>;
}
