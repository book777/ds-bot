const fs = require('fs')

const { DisTube, RepeatMode } = require('distube')
const Discord = require('discord.js')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

const config = require('./config.json')

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
    compress: true
  }
})
client.config = config
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
client.emotes = config.emoji

fs.readdir('./src/commands/', (err, files) => {
  if (err) return console.error('Error when read commands folders: ', err.message)

  const jsFiles = files.filter(f => f.split('.').pop() === 'js')
  if (jsFiles.length <= 0) return console.log('Could not find any commands!')
  jsFiles.forEach(file => {
    try {
      const cmd = require(`./commands/${file}`)
      client.commands.set(cmd.name, cmd)
      if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
    } catch (err) {
      console.error(`Error when parse command ${file}: `, err.message)
    }
  })
})

client.on('ready', () => {
  console.log(`${client.user.tag} is ready to play music.`)
})

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  if (!message.content.startsWith(config.prefix)) return

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return
  if (cmd.inVoiceChannel && !message.member.voice.channel) {
    return message.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
  }

  try {
    cmd.run(client, message, args)
  } catch (err) {
    console.error('Command error:', err.message)
    message.channel.send(`${client.emotes.error} | Error: \`${err}\``)
  }
})

const loop = repeatMode => {
  switch (repeatMode) {
    case RepeatMode.DISABLED:
      return 'Off'
    case RepeatMode.QUEUE:
      return 'All Queue'
    case RepeatMode.SONG:
      return 'This Song'
    default:
      return 'unknown'
  }
}

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${loop(
    queue.repeatMode
  )}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        song.user
      }\n${status(queue)}`
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    console.error(e)
  })
  .on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))

client
  .login(config.token)
  .then(() => console.info('Bot is logged in'))
  .catch(err => console.error('Cannot log in bot:', err.message))
