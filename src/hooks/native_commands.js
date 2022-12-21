const Discord = require('discord.js')
const config = require('../config.json')

const nativeCommands = async client => {
  const rest = new Discord.REST({ version: '10' }).setToken(config.token)
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Discord.Routes.applicationCommands(client.application.id), {
      body: [
        {
          name: 'ping',
          description: 'Replies with Pong!'
        }
      ]
    })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}

module.exports = nativeCommands
