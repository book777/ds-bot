import { Channel, Constants, VoiceBasedChannel, VoiceBasedChannelTypes } from 'discord.js'
import config from '../config'
import { Command } from '../types'

export default {
  name: 'join',
  aliases: ['j', 'move', 'mv'],
  run: async (client, message, args) => {
    let voiceChannel: VoiceBasedChannel | Channel | null = message.member?.voice.channel || null
    if (args[0]) {
      voiceChannel = await client.channels.fetch(args[0])
      if (!Constants.VoiceBasedChannelTypes.includes(voiceChannel?.type as VoiceBasedChannelTypes)) {
        return message.channel.send(`${config.emoji.error} | ${args[0]} is not a valid voice channel!`)
      }
    }

    if (!voiceChannel) {
      return message.channel.send(
        `${config.emoji.error} | You must be in a voice channel or enter a voice channel id!`
      )
    }

    await client.distube.voices.join(voiceChannel)
  }
} as Command
