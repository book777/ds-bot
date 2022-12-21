export default {
  name: 'help',
  aliases: ['h', 'cmd', 'command'],
  run: async (client, message, args) => {
    console.debug('fff', { client, message, args })
    message.channel.send({
      embeds: [
        await client
          .MessageEmbed()
          .setTitle('Commands')
          .setDescription(client.commands.map(cmd => `\`${cmd.name}\``).join(', '))
          .setColor('BLURPLE')
      ]
    })
  }
}
