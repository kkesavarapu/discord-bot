import commands from './commands'
import handlers from './handlers'
import logger from './blocks/logging'
import config from './config/config'

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

    it('does process command messages', () => {
        // Establish mocks for all the commands
        logger.debug = jest.fn()
        for (let c in commands) {
            commands[c] = jest.fn()
        }

        // Establish the test data
        const client = {}
        const message = {
            content: config.prefix + 'command a b',
            author: { username: 'user' },
            channel: { name: 'channel', send: jest.fn() }
        }
        const handler = handlers.onMessage(client)

        // Execute the action under test
        handler(message)

        // Verify that each of the mocks was invoked with the appropriate arguments
        for (let c in commands) {
            expect(commands[c].mock.calls.length).toBe(1)
            expect(commands[c].mock.calls[0][0]).toEqual(client)
            expect(commands[c].mock.calls[0][1]).toEqual(message)
            expect(commands[c].mock.calls[0][2]).toEqual('command')
            expect(commands[c].mock.calls[0][3]).toEqual(['a', 'b'])
        }
    })

    it('does process command in lower case', () => {
        // Establish mocks for all the commands
        logger.debug = jest.fn()
        for (let c in commands) {
            commands[c] = jest.fn()
        }

        // Establish the test data
        const client = {}
        const message = {
            content: config.prefix + 'CoMmAnD A b',
            author: { username: 'user' },
            channel: { name: 'channel', send: jest.fn() }
        }
        const handler = handlers.onMessage(client)

        // Execute the action under test
        handler(message)

        // Verify that each of the mocks was invoked with the appropriate arguments
        for (let c in commands) {
            expect(commands[c].mock.calls.length).toBe(1)
            expect(commands[c].mock.calls[0][0]).toEqual(client)
            expect(commands[c].mock.calls[0][1]).toEqual(message)
            expect(commands[c].mock.calls[0][2]).toEqual('command')
            expect(commands[c].mock.calls[0][3]).toEqual(['A', 'b'])
        }
    })

    it('does not process non-command messages', () => {
        // Establish mocks for all the commands
        logger.debug = jest.fn()
        for (let c in commands) {
            commands[c] = jest.fn()
        }

        // Establish the test data
        const client = {}
        const message = {
            content: 'command a b',
            author: { username: 'user' },
            channel: { name: 'channel', send: jest.fn() }
        }
        const handler = handlers.onMessage(client)

        // Execute the action under test
        handler(message)

        // Verify that each of the mocks was invoked with the appropriate arguments
        for (let c in commands) {
            expect(commands[c].mock.calls.length).toBe(0)
        }
    })

    it('does not process command messages from bots', () => {
        // Establish mocks for all the commands
        logger.debug = jest.fn()
        for (let c in commands) {
            commands[c] = jest.fn()
        }

        // Establish the test data
        const client = {}
        const message = {
            content: '.command a b',
            author: { username: 'user', bot: true },
            channel: { name: 'channel', send: jest.fn() }
        }
        const handler = handlers.onMessage(client)

        // Execute the action under test
        handler(message)

        // Verify that each of the mocks was invoked with the appropriate arguments
        for (let c in commands) {
            expect(commands[c].mock.calls.length).toBe(0)
        }
    })

    it('logs the event', () => {
        // Configure the context for running the test
        logger.debug = jest.fn()
        const client = {}
        const message = {
            content: config.prefix + 'command a b',
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
            args: ['a', 'b']
        })
    })
})