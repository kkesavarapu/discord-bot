import Discord from 'discord.js'

import responses from './config/responses'
import parse from './config/parsing'
import auth from './config/authentication'
import logger from './config/logging'

const client = new Discord.Client()

client.on('ready', () => {
    logger.info('Connected as', client.user.username)
})

client.on('message', message => {
    // Ensure that the message the event is responding to is valid and a
    // command. If it isn't, then do not proceed any further
    if (!message || message.content.charAt(0) !== parse.prefix) return

    // Tokenize message against structure [command][sperator][input]
    let content = message.content
    let command = content.split(parse.seperator)[0]
    let input = content.substring(command.length + 1, content.length)

    // Temporary: Be randomly idle
    let index = Math.floor(Math.random() * responses.idle.length)
    message.reply(responses.idle[index])

    logger.debug(
        message.author.username,
        'commanded',
        command,
        'against',
        input
    )
})

client.login(auth.token)
    .catch((err) => { logger.error('Login failed', '-', err) })