import Discord from 'discord.js'
import handlers from './handlers'
import commands from './commands'
import error from './blocks/error-handling'

const client = new Discord.Client()

// Register handlers for the events that are relevant to the bot
client.on('ready', handlers.onReady(client))
client.on('message', handlers.onMessage(client))

// Login into discord with an identity established by the oauth token
// This is the entry to the application
client.login(process.env.DISCORD_BOT_TOKEN)