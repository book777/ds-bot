import Discord from 'discord.js'
import config from '../config.js'

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

export default nativeCommands
