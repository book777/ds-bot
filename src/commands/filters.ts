import config from '../config'
import { Command } from '../types'

export default {
  name: 'filter',
  aliases: ['filters'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) {
      return message.channel.send(`${config.emoji.error} | There is nothing in the queue right now!`)
    }
    const filter = args[0]
    if (filter === 'off' && queue.filters.size) {
      queue.filters.clear()
    } else {
      if (Object.keys(client.distube.filters).includes(filter)) {
        if (queue.filters.has(filter)) {
          queue.filters.remove(filter)
        } else {
          queue.filters.add(filter)
        }
      } else {
        if (args[0]) {
          return message.channel.send(`${config.emoji.error} | Not a valid filter`)
        } else {
          return message.channel.send(`${config.emoji.error} | Not a valid filter2`)
        }
      }
    }
    message.channel.send(`Current Queue Filter: \`${queue.filters.names.join(', ') || 'Off'}\``)
  }
} as Command
