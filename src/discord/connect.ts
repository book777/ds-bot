import config from "../config";
import { Client as ClientType } from "../types";
import { commandsConnect } from "./commands_connect";
import { discordHooks } from "./hooks";
import { nativeCommandReg } from "./native_command_reg";

const discordConnect = (client: ClientType) => {
  discordHooks(client);

  commandsConnect(client);

  client
    .login(process.env.DC_TOKEN || config.token)
    .then(async () => {
      console.info("Bot is logged in");
      nativeCommandReg(client);
    })
    .catch(err => console.error("Bot cannot log in:", err));
};

export { discordConnect };
