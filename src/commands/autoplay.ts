import config from '../config'
import { Command } from '../types'

export default {
  name: 'autoplay',
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${config.emoji.error} | There is nothing in the queue right now!`)
    const autoplay = queue.toggleAutoplay()
    message.channel.send(`${config.emoji.success} | AutoPlay: \`${autoplay ? 'On' : 'Off'}\``)
  }
} as Command
