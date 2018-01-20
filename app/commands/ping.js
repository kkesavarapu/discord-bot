export default async (client, message, command, args) => {
    // Determine which commands to respond to and ignore the rest
    if(!['ping', 'p'].includes(command)) return

    // Send a message to the channel the command was invoked from and
    // then edit it once an acknowledgement is received with the return
    // trip time
    const ack = await message.channel.send("ping..")
    
    // Calculate the latency from various key network points and edit
    // the original message with the measurements
    const latency = {
        total: ack.createdTimestamp - message.createdTimestamp,
        discord: client.ping,
        host: (ack.createdTimestamp - message.createdTimestamp) - client.ping
    }
    
    let reply = 'I took a trip and here\'s what I found..\n'
    reply += `..time on the entire trip: **${latency.total}ms**\n`
    reply += `..time inside of discord: **${latency.discord}ms**\n`
    reply += `..time outside of discord: **${latency.host}ms**`

    ack.edit(reply)
}