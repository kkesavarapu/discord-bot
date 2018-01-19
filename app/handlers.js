import logger from './concerns/logging'
import parse from './config/parsing'
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
    if (!message || message.content.charAt(0) !== parse.prefix) return

    // Tokenize message against structure [command][seperator][input]
    let content = message.content
    let command = content.split(parse.seperator)[0].substr(1)
    let input = content.substr(command.length + parse.seperator.length + 1)

    // Temporary: Be randomly idle
    // TODO: Evaluate the message against all the commands
    let index = Math.floor(Math.random() * responses.idle.length)
    message.channel.send(responses.idle[index])

    logger.debug('Message recognized as a command', {
        author: message.author.username,
        channel: message.channel.name,
        command: command,
        input: input
    })
}

export default {
    onReady: onReady,
    onMessage: onMessage
}