import Discord, { ClientOptions } from "discord.js";
import { RepeatMode } from "distube";

export default {
  prefix: "?",
  token: "ODkxNDE2OTk4NTAyODkxNTcw.GKRXvL.uicg82QQIu9loqdd9A-5n8O751YBZ6xmQlGtAU",
  volume: {
    default: 12,
    min: 0,
    max: 120
  },
  repeat: {
    default: RepeatMode.QUEUE
  },
  emoji: {
    play: "▶️",
    stop: "⏹️",
    queue: "📄",
    success: "☑️",
    repeat: "🔁",
    error: "❌"
  },
  discordOptions: {
    intents: [
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildMessages,
      Discord.GatewayIntentBits.GuildVoiceStates,
      Discord.GatewayIntentBits.MessageContent
    ],
    allowedMentions: {
      parse: ["roles", "users", "everyone"]
    },
    ws: {
      compress: false // not working
    }
  } as ClientOptions
};
