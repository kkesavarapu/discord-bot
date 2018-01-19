import Discord from 'discord.js'
import auth from './config/authentication'
import handlers from './handlers'
import error from './concerns/errors'

const client = new Discord.Client()

// Register handlers for the events that are relevant to the bot
client.on('ready', handlers.onReady(client))
client.on('message', handlers.onMessage(client))

// Login into discord with an identity established by the oauth token
// This is the entry to the application
client.login(auth.token).catch(error('Login Failed'))