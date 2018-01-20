export default (client, message, command, args) => {
    // Determine which commands to respond to and ignore the rest
    if(!['roll', 'r'].includes(command)) return

    message.channel.send('\`' + args.join(' ') + '\`')
}