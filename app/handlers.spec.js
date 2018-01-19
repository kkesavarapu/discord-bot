import handlers from './handlers'
import logger from './concerns/logging'
import parse from './config/parsing'

describe('onReady Handler', () => {
    it('logs the event', () => {
        // Configure the context for running the test
        logger.info = jest.fn()
        const client = { user: { username: 'name', id: 'id' } }
        const handler = handlers.onReady(client)

        // Execute the action under test
        handler()

        // Verify the result
        expect(logger.info.mock.calls.length).toBe(1)
        expect(logger.info.mock.calls[0][0]).toBe('Connected and ready to accept events')
        expect(logger.info.mock.calls[0][1]).toEqual({ username: client.user.username, userId: client.user.id })
    })
})

describe('onMessage Handler', () => {
    it('does not process non-command messages', () => {
        // Configure the context for running the test
        logger.debug = jest.fn()
        const client = {}
        const message = {
            content: 'command input input',
            author: { username: 'user' },
            channel: { name: 'channel', send: jest.fn() }
        }
        const handler = handlers.onMessage(client)

        // Execute the action under test
        handler(message)

        // Verify the behavior and result
        expect(logger.debug.mock.calls.length).toBe(0)
    })

    it('does process command messages', () => {
        // Configure the context for running the test
        logger.debug = jest.fn()
        const client = {}
        const message = {
            content: parse.prefix + 'command input input',
            author: { username: 'user' },
            channel: { name: 'channel', send: jest.fn() }
        }
        const handler = handlers.onMessage(client)

        // Execute the action under test
        handler(message)

        // Verify the behavior and result
        expect(message.channel.send.mock.calls.length).toBe(1)
    })

    it('logs the event', () => {
        // Configure the context for running the test
        logger.debug = jest.fn()
        const client = {}
        const message = {
            content: parse.prefix + 'command input input',
            author: { username: 'user' },
            channel: { name: 'channel', send: jest.fn() }
        }
        const handler = handlers.onMessage(client)

        // Execute the action under test
        handler(message)

        // Verify the behavior and result
        expect(logger.debug.mock.calls.length).toBe(1)
        expect(logger.debug.mock.calls[0][0]).toBe('Message recognized as a command')
        expect(logger.debug.mock.calls[0][1]).toEqual({
            author: message.author.username,
            channel: message.channel.name,
            command: 'command',
            input: 'input input'
        })
    })
})