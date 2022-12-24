import Discord from 'discord.js'
import { Client } from '../types'

const nativeCommandReg = (client: Client) => {
  client.rest.put(Discord.Routes.applicationCommands(client.application?.id || '-1'), {
    body: client.commands.map(command => ({
      name: command.name,
      description: command?.register?.description || command.name, // Required
      ...command.register
    }))
  }).then(() => {
    console.log('App native commands updated successfully')
  }).catch(err => {
    console.log('Cannot update app native commands:', err)
  })
}

export { nativeCommandReg }
