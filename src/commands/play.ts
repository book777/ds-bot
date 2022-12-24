import config from '../config'
import { Command } from '../types'
import { GuildTextBasedChannel } from 'discord.js'
import { removeSimilarSongs } from '../util/remove_similar_songs'

export default {
  name: 'play',
  aliases: ['p'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const string = args.join(' ')
    if (!string) {
      return message.channel.send(`${config.emoji.error} | Please enter a song url or query to search.`)
    }

    const voiceChannel = message.member?.voice.channel
    if (!voiceChannel) {
      // Checked by inVoiceChannel
      console.error('User is not in voice channel')
      return
    }

    await client.distube.play(voiceChannel, string, {
      member: message.member,
      textChannel: message.channel as GuildTextBasedChannel,
      message
    })
    removeSimilarSongs()

    // todo if queue.len === 0 -> config.volume.default
  }
} as Command
