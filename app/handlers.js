import commands from './commands'
import logger from './blocks/logging'
import config from './config/config'
import responses from './config/responses'

// Handler for event indicating that a connection has been established and the
// bot is ready for interaction
export const onReady = (client) => () => {
    logger.info('Connected and ready to accept events', {
        username: client.user.username,
        userId: client.user.id
    })
}

// Handler for when a message is posted to any of the channels that the bot
// has access to
export const onMessage = (client) => (message) => {
    // Ensure that the message the event is responding to is valid and a
    // command. If it isn't, then do not proceed any further
    if (!message || message.content.charAt(0) !== config.prefix) return

    // Only respond to users that are human to avoid going into loops of
    // discussions with bots posting commands to each other
    if (message.author.bot) return

    // Tokenize message against structure [prefix][command] [arg] [arg]..
    let tokens = message.content.slice(config.prefix.length).trim().split(' ')
    const command = tokens.shift().toLowerCase()
    const args = [...tokens]
    
    logger.debug('Message recognized as a command', {
        author: message.author.username,
        channel: message.channel.name,
        command: command,
        args: args
    })

    // Broadcast the message through every command and let them decide how
    // to handle it (if at all)
    for (let c in commands) {
        commands[c](client, message, command, args)
    }
}

export default {
    onReady: onReady,
    onMessage: onMessage
}