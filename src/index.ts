
import { DisTube } from 'distube'
import Discord from 'discord.js'
import { SpotifyPlugin } from '@distube/spotify'
import { SoundCloudPlugin } from '@distube/soundcloud'
import { YtDlpPlugin } from '@distube/yt-dlp'

import config from './config'
import nativeCommands from './hooks/native_commands'
import playStatus from './util/play_status'
import { Client as ClientType } from './types'
import commands from './commands'

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

client.distube = new DisTube(client, {
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
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

commands.forEach(cmd => {
  client.commands.set(cmd.name, cmd)
  if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
})

client.on('ready', () => {
  console.log(`${client.user?.tag} is ready to play music.`)
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return

  /* const inter: Discord.ChatInputCommandInteraction = interaction
  const command: Command = null;
  command.run(inter.client, awaitModalSubmit) */

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!')
  }
})

client.on('messageCreate', async message => {
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

  try {
    cmd.run(client, message, args).catch(err => console.error('Command error:', err.message))
  } catch (err) {
    console.error('Command error:', err)
    message.channel.send(`${config.emoji.error} | Error: \`${err}\``)
  }
})

client.distube
  .on('playSong', (queue, song) =>
    queue?.textChannel?.send(
      `${config.emoji.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        song.user
      }\n${playStatus(queue)}`
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

client
  .login(config.token)
  .then(async () => {
    console.info('Bot is logged in')

    await nativeCommands(client)
  })
  .catch(err => console.error('Cannot log in bot:', err.message))
