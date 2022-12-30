import config from '../config'
import { Command } from '../types'
import { GuildTextBasedChannel } from 'discord.js'
import { removeSimilarSongs } from '../util/remove_similar_songs'

export default {
  name: 'play',
  aliases: ['p', 'pl'],
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

    const hasQueue = !!client.distube.getQueue(message)

    await client.distube.play(voiceChannel, string, {
      // ./node_modules/distube/dist/index.js:2234
      member: message.member,
      textChannel: message.channel as GuildTextBasedChannel,
      message
    }).then(() => {
      if (!hasQueue) {
        const queue = client.distube.getQueue(message)
        queue?.setVolume(config.volume.default)
        queue?.setRepeatMode(config.repeat.default)
        // todo set before "on distube playSong"
      }
    })

    removeSimilarSongs()

    // todo if queue.len === 0 -> config.volume.default
  }
} as Command
