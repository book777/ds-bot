import Discord from "discord.js";
import dotenv from "dotenv";

import config from "./config";
import { discordConnect } from "./discord/connect";
import { distubeConnect } from "./distube/connect";
import { firebaseConnect } from "./firebase/connect";
import { Client as ClientType } from "./types";
import { exitHandler } from "./util/exit";

dotenv.config();

const client = new Discord.Client(config.discordOptions) as ClientType;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

firebaseConnect(client);

exitHandler(client);

discordConnect(client);

distubeConnect(client);
