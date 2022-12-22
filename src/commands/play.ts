import config from '../config'
import { Command } from '../types'

export default {
  name: 'play',
  aliases: ['p'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const string = args.join(' ')
    if (!string) return message.channel.send(`${config.emoji.error} | Please enter a song url or query to search.`)
    client.distube.play(message.member.voice.channel, string, {
      member: message.member,
      textChannel: message.channel,
      message
    })
  }
} as Command
