import config from '../config'
import { Command } from '../types'
import { GuildTextBasedChannel } from 'discord.js'

export default {
  name: 'playtop',
  aliases: ['pt'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const string = args.join(' ')
    if (!string) return message.channel.send(`${config.emoji.error} | Please enter a song url or query to search.`)

    const voiceChannel = message.member?.voice.channel
    if (!voiceChannel) {
      console.error('User is not in voice channel')
      return
    }

    await client.distube.play(message.member.voice.channel, string, {
      member: message.member,
      textChannel: message.channel as GuildTextBasedChannel,
      message,
      position: 1
    })
  }
} as Command
