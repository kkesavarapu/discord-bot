import responses from '../config/responses'

export default (client, message, command, args) => {
    // Determine which commands to respond and ignore the rest
    if (!['speak', 's'].includes(command)) return

    // Gather a random message from the idle responses and present it to the
    // channel the request came in on
    let response = Math.floor(Math.random() * responses.idle.length)
    message.channel.send(responses.idle[response])
}