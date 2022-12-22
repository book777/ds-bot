import config from '../config'
import { Command } from '../types'

export default {
  name: 'repeat',
  aliases: ['loop', 'rp'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${config.emoji.error} | There is nothing playing!`)
    let mode: number|string = 0
    switch (args[0]) {
      case 'off':
        mode = 0
        break
      case 'song':
        mode = 1
        break
      case 'queue':
        mode = 2
        break
    }
    mode = queue.setRepeatMode(mode)
    mode = mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : 'Off'
    message.channel.send(`${config.emoji.repeat} | Set repeat mode to \`${mode}\``)
  }
} as Command
