import { DisTube } from 'distube'
import Discord from 'discord.js'
import { SpotifyPlugin } from '@distube/spotify'
import { SoundCloudPlugin } from '@distube/soundcloud'
import { YtDlpPlugin } from '@distube/yt-dlp'

import config from './config'
import { nativeCommandReg } from './ds_interactions/native_command_reg'
import { playStatus } from './util/play_status'
import { Client as ClientType } from './types'
import { commands } from './commands'
import { nativeCommandParse } from './ds_interactions/native_command_parse'

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent
  ],
  allowedMentions: {
    parse: ['roles', 'users', 'everyone']
  },
  ws: {
    compress: false // not working
  }
}) as ClientType
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

const distube = new DisTube(client, {
  leaveOnFinish: false,
  leaveOnStop: false,
  leaveOnEmpty: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin({ update: true })
  ],
  ytdlOptions: {
    liveBuffer: 30,
    dlChunkSize: 5242880 // 5MB
  },
  nsfw: true
})
distube
  .on('playSong', (queue, song) =>
    // todo add silent option
    queue?.textChannel?.send(
      {
        content: `${config.emoji.play} | Play now\n${playStatus(queue)}`,
        embeds: [{
          title: song.name,
          url: song.url,
          color: 15548997, // Red from https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812s
          description: `Duration ${song.formattedDuration}\nRequested by: ${song.user}`
        }]
      }
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel?.send(
      `${config.emoji.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel?.send(
      `${config.emoji.success} | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${playStatus(queue)}`
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`${config.emoji.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    console.error(e)
  })
  .on('empty', async (channel) => {
    await channel.stop()
    console.log('Voice channel is empty! Leaving the channel...')
  })
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${config.emoji.error} | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel?.send('Finished!'))

client.distube = distube

commands.forEach(cmd => {
  client.commands.set(cmd.name, cmd)
  if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
})

client
  .on('ready', () => {
    console.log(`${client.user?.tag} is ready to play music.`)
  })
  .on('interactionCreate', interaction => nativeCommandParse(client, interaction))
  .on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return
    if (!message.content.startsWith(config.prefix)) return

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const command = args.shift()?.toLowerCase()
    if (!command) return

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command) || '')
    if (!cmd) return
    if (cmd.inVoiceChannel && !message.member?.voice.channel) {
      message.channel.send(`${config.emoji.error} | You must be in a voice channel!`)
      return
    }

    cmd.run(client, message, args).catch((err) => {
      console.error('Command error:', err)
      message.channel.send(`${config.emoji.error} | Error: \`${err}\``)
    })
  })
  .on('voiceStateUpdate', async (_oldState, newState) => {
    // Bot not in voice
    if (client.voice.adapters.size === 0) return
    const queue = client.distube.getQueue(newState.guild.id)
    if (!queue) return

    const canHearUsersOnVoiceChannelWithBot = newState.guild.members.cache
      .filter(member =>
        !member.user.bot &&
        !member.voice.deaf &&
        !member.voice.serverDeaf &&
        member.voice.channelId &&
        member.voice.channelId === queue.voice.channelId
      ).size

    if (queue.paused) {
      if (canHearUsersOnVoiceChannelWithBot !== 0) {
        queue.resume()
        // console.log(`Resume music on server ${queue.id}`)
      }
    } else {
      if (canHearUsersOnVoiceChannelWithBot === 0) {
        queue.pause() // todo promise
        // console.log(`Pause on server ${queue.id}`)
      }
    }
  })

client
  .login(config.token)
  .then(async () => {
    console.info('Bot is logged in')
    nativeCommandReg(client)
  })
  .catch(err => console.error('Cannot log in bot:', err.message))
