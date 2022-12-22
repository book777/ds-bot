import { Command } from '../types'
import config from '../config'

export default {
  name: 'help',
  aliases: ['h', 'cmd', 'command'],
  run: async (client, message) => {
    message.channel.send(
      `${config.emoji.error} | You must be in a voice channel or enter a voice channel id!`
    )

    message.channel.send({
      embeds: [
        {
          title: 'Commands',
          description: client.commands.map(cmd => `\`${cmd.name}\``).join(', '),
          color: 1
        }
      ]
    })
  }
} as Command
