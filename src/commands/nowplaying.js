export default {
  name: 'nowplaying',
  aliases: ['np'],
  inVoiceChannel: true,
  run: async (client, message, _args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
    const song = queue.songs[0]
    message.channel.send(`${client.emotes.play} | I'm playing **\`${song.name}\`**, by ${song.user}`)
  }
}
