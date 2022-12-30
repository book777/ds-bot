import config from '../config'
import { Command } from '../types'

export default {
  name: 'skip',
  aliases: ['sk'],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${config.emoji.error} | There is nothing in the queue right now!`)
    try {
      const song = await queue.skip()
      message.channel.send(`${config.emoji.success} | Skipped! Now playing:\n${song.name}`)
    } catch (e) {
      message.channel.send(`${config.emoji.error} | ${e}`)
    }
  }
} as Command
