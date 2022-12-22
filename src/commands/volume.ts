import config from '../config'
import { Command } from '../types'

export default {
  name: 'volume',
  aliases: ['v', 'set', 'set-volume'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${config.emoji.error} | There is nothing in the queue right now!`)
    const volume = parseInt(args[0])
    if (isNaN(volume)) return message.channel.send(`${config.emoji.error} | Please enter a valid number!`)
    queue.setVolume(volume)
    message.channel.send(`${config.emoji.success} | Volume set to \`${volume}\``)
  }
} as Command