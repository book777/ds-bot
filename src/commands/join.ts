import { Constants, VoiceBasedChannel, VoiceBasedChannelTypes } from 'discord.js'
import config from '../config'
import { Command } from '../types'

export default {
  name: 'join',
  aliases: ['j', 'move', 'mv'],
  run: async (client, message, args) => {
    if (args.length > 0) {
      const channel = await client.channels.fetch(args[0])

      if (channel && Constants.VoiceBasedChannelTypes.includes(channel.type as VoiceBasedChannelTypes)) {
        await client.distube.voices.join(channel as VoiceBasedChannel)
      } else {
        return message.channel.send(`${config.emoji.error} | ${args[0]} is not a valid voice channel!`)
      }
    }

    const channel = message.member?.voice.channel || null
    if (channel) {
      await client.distube.voices.join(channel)
    } else {
      return message.channel.send(
        `${config.emoji.error} | You must be in a voice channel or enter a voice channel id!`
      )
    }
  }
} as Command
