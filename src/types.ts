import Discord from 'discord.js'
import { DisTube } from 'distube'

export type MessageCommon = {
  send: (message: string) => Promise<void>
}

export type Command = {
  name: string;
  aliases?: string[];
  inVoiceChannel?: boolean;
  // eslint-disable-next-line no-use-before-define
  run: (client: Client, message: Discord.Message, args: string[]) => Promise<void>;
  register?: {
    // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
    description?: string; // max 100
    options?: {
      name: string; // max 32
      type: Discord.ApplicationCommandOptionType;
      properties?: (keyof Discord.ApplicationCommandOption)[];
      required?: boolean;
      description?: string; // max 100
      min_value?: number;
      max_value?: number;
    }[]
  },
}

export interface Client extends Discord.Client {
  distube: DisTube;
  commands: Discord.Collection<string, Command>;
  aliases: Discord.Collection<string, string>;
}
