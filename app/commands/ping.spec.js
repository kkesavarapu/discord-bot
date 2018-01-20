import ping from './ping'

describe('Ping Command', () => {
    it('activates only on configured command aliases', async () => {
        // Establish the discord mock message objects to ensure it is
        // not used
        const message = {
            createdTimeStamp: 0,
            channel: {
                send: jest.fn()
            }
        }

        // Establish mock data and objects for the test context
        const client = {}
        const command = 'nope'
        const args = []

        // Perform the action under test
        await ping(client, message, command, args)

        // Verify that no messages were sent
        expect(message.channel.send.mock.calls.length).toBe(0)

    })

    it('posts a message and edits it with latency metrics', async () => {
        // Establish the discord message and acknowledgement objects and
        // mocks to make sure the ping calculations are controlled
        const ack = { createdTimestamp: 100, edit: jest.fn() }
        const message = {
            createdTimestamp: 0,
            channel: {
                send: jest.fn().mockReturnValue(ack)
            }
        }

        // Establish theremaining data for the test context
        const client = { ping: 10 }
        const command = 'ping'
        const args = []

        // Perform the action under test
        await ping(client, message, command, args)

        // Verify that there was a message sent to the channel and then
        // it was edited
        expect(message.channel.send.mock.calls.length).toBe(1)
        expect(ack.edit.mock.calls.length).toBe(1)

        // Verify that the appropriate message was sent to the channel
        // and the reply had the right measurements and format
        let reply = 'I took a trip and here\'s what I found..\n'
        reply += '..time on the entire trip: **100ms**\n'
        reply += '..time inside of discord: **10ms**\n'
        reply += '..time outside of discord: **90ms**'

        expect(message.channel.send.mock.calls[0][0]).toBe('ping..')
        expect(ack.edit.mock.calls[0][0]).toBe(reply)

    })
})