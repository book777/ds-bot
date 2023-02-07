import { commands } from "../commands";
import { Client as ClientType } from "../types";

const commandsConnect = (client: ClientType) => {
  commands.forEach(cmd => {
    client.commands.set(cmd.name, cmd);
    if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name));
  });
};

export { commandsConnect };
