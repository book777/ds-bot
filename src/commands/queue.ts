import config from '../config'
import { Command } from '../types'

export default {
  name: 'queue',
  aliases: ['q'],
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${config.emoji.error} | There is nothing playing!`)
    const q = queue.songs
      .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
      .join('\n')
    message.channel.send(`${config.emoji.queue} | **Server Queue**\n${q}`)
  }
} as Command
