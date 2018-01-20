import speak from './speak'
import responses from '../config/responses'

describe('Speak Command', () => {
    it('activates only on configured command aliases', () => {
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
        speak(client, message, command, args)

        // Verify that no messages were sent
        expect(message.channel.send.mock.calls.length).toBe(0)
    })

    it('sends a random response as a message', () => {
        // Establish the mocks functions to control behavior of
        // other functions not under test
        const message = {
            createdTimeStamp: 0,
            channel: {
                send: jest.fn()
            }
        }
        Math.random = jest.fn().mockReturnValue(0)

        // Establish mock data and objects for the test context
        const client = {}
        const command = 'speak'
        const args = []

        // Perform the action under test
        speak(client, message, command, args)

        // Verify that no messages were sent
        expect(message.channel.send.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls[0][0]).toEqual(responses.idle[0])
    })
})