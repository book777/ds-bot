import { Command } from "../types";

export default {
  name: "leave",
  run: async (client, message) => {
    client.distube.voices.leave(message);
  }
} as Command;
