import Discord from 'discord.js'
import config from '../config'
import { Client } from '../types'

const nativeCommands = async (client: Client) => {
  const rest = new Discord.REST({ version: '10' }).setToken(config.token)
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Discord.Routes.applicationCommands(client.application?.id || '-1'), {
      body: [
        {
          name: 'ping',
          description: 'Replies with Pong!'
        }
      ] // todo
    })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}

export default nativeCommands
