import rollDice from './roll-dice'

describe('Roll Dice Command', () => {
    it('activates only on configured command aliases', async () => {
        // Establish the mock objects for the test context
        const message = { channel: { send: jest.fn() } }
        const client = {}
        const command = 'nope'
        const args = ['krk']

        Math.random = jest.fn().mockReturnValue(0.01)

        // Perform the action under test
        rollDice(client, message, command, args)

        expect(Math.random.mock.calls.length).toBe(0)
        expect(message.channel.send.mock.calls.length).toBe(0)
    })

    it('should default to zero if unknown pattern', () => {
        // Establish the mock objects for the test context
        const message = { channel: { send: jest.fn() } }
        const client = {}
        const command = 'roll'
        const args = ['krk']

        Math.random = jest.fn().mockReturnValue(0.01)

        // Perform the action under test
        rollDice(client, message, command, args)

        // Verify that the result of the evaluation was correct
        const response = `**0**\n` +
            '\`\`\`' +
            `roll \n` +
            `ask  krk` +
            '\`\`\`'

        expect(Math.random.mock.calls.length).toBe(0)
        expect(message.channel.send.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls[0][0]).toEqual(response)
    })

    it('should evaluate to the same numeric value', () => {
        // Establish the mock objects for the test context
        const message = { channel: { send: jest.fn() } }
        const client = {}
        const command = 'roll'
        const args = ['4']

        Math.random = jest.fn().mockReturnValue(0.01)

        // Perform the action under test
        rollDice(client, message, command, args)

        // Verify that the result of the evaluation was correct
        const response = `**4**\n` +
            '\`\`\`' +
            `roll 4\n` +
            `ask  4` +
            '\`\`\`'

        expect(Math.random.mock.calls.length).toBe(0)
        expect(message.channel.send.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls[0][0]).toEqual(response)
    })

    it('should evaluate to the same negative numeric value', () => {
        // Establish the mock objects for the test context
        const message = { channel: { send: jest.fn() } }
        const client = {}
        const command = 'roll'
        const args = ['-4']

        Math.random = jest.fn().mockReturnValue(0.01)

        // Perform the action under test
        rollDice(client, message, command, args)

        // Verify that the result of the evaluation was correct
        const response = `**-4**\n` +
            '\`\`\`' +
            `roll -4\n` +
            `ask  -4` +
            '\`\`\`'

        expect(Math.random.mock.calls.length).toBe(0)
        expect(message.channel.send.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls[0][0]).toEqual(response)
    })

    it('should roll a dice for a random value no less than 1', () => {
        // Establish the mock objects for the test context
        const message = { channel: { send: jest.fn() } }
        const client = {}
        const command = 'roll'
        const args = ['1d4']

        Math.random = jest.fn().mockReturnValue(0.01)

        // Perform the action under test
        rollDice(client, message, command, args)

        // Verify that the result of the evaluation was correct
        const response = `**1**\n` +
            '\`\`\`' +
            `roll 1\n` +
            `ask  1d4` +
            '\`\`\`'

        expect(Math.random.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls[0][0]).toEqual(response)
    })

    it('should roll a dice for a random value no greater than dice sides', () => {
        // Establish the mock objects for the test context
        const message = { channel: { send: jest.fn() } }
        const client = {}
        const command = 'roll'
        const args = ['1d4']

        Math.random = jest.fn().mockReturnValue(0.99)

        // Perform the action under test
        rollDice(client, message, command, args)

        // Verify that the result of the evaluation was correct
        const response = `**4**\n` +
            '\`\`\`' +
            `roll 4\n` +
            `ask  1d4` +
            '\`\`\`'

        expect(Math.random.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls[0][0]).toEqual(response)
    })

    it('should expand a a multi-die roll (i.e 2d10 --> 1d10 + 1d10)', () => {
        // Establish the mock objects for the test context
        const message = { channel: { send: jest.fn() } }
        const client = {}
        const command = 'roll'
        const args = ['2d4']

        Math.random = jest.fn().mockReturnValue(0.99)

        // Perform the action under test
        rollDice(client, message, command, args)

        // Verify that the result of the evaluation was correct
        const response = `**8**\n` +
            '\`\`\`' +
            `roll [4+4]\n` +
            `ask  2d4` +
            '\`\`\`'

        expect(Math.random.mock.calls.length).toBe(2)
        expect(message.channel.send.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls[0][0]).toEqual(response)
    })

    it('should add a series of numbers together (left to right)', () => {
        // Establish the mock objects for the test context
        const message = { channel: { send: jest.fn() } }
        const client = {}
        const command = 'roll'
        const args = ['1+4+2']

        Math.random = jest.fn().mockReturnValue(0.99)

        // Perform the action under test
        rollDice(client, message, command, args)

        // Verify that the result of the evaluation was correct
        const response = `**7**\n` +
            '\`\`\`' +
            `roll 1+4+2\n` +
            `ask  1+4+2` +
            '\`\`\`'

        expect(Math.random.mock.calls.length).toBe(0)
        expect(message.channel.send.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls[0][0]).toEqual(response)
    })

    it('should subtract a series of numbers from each other (left to right)', () => {
        // Establish the mock objects for the test context
        const message = { channel: { send: jest.fn() } }
        const client = {}
        const command = 'roll'
        const args = ['5-4-2']

        Math.random = jest.fn().mockReturnValue(0.99)

        // Perform the action under test
        rollDice(client, message, command, args)

        // Verify that the result of the evaluation was correct
        const response = `**-1**\n` +
            '\`\`\`' +
            `roll 5-4-2\n` +
            `ask  5-4-2` +
            '\`\`\`'

        expect(Math.random.mock.calls.length).toBe(0)
        expect(message.channel.send.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls[0][0]).toEqual(response)
    })

    it('should handle multiple operation types in one expression', () => {
        // Establish the mock objects for the test context
        const message = { channel: { send: jest.fn() } }
        const client = {}
        const command = 'roll'
        const args = ['2d20+10-5']

        Math.random = jest.fn().mockReturnValue(0.99)

        // Perform the action under test
        rollDice(client, message, command, args)

        // Verify that the result of the evaluation was correct
        const response = `**45**\n` +
            '\`\`\`' +
            `roll [20+20]+10-5\n` +
            `ask  2d20+10-5` +
            '\`\`\`'

        expect(Math.random.mock.calls.length).toBe(2)
        expect(message.channel.send.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls[0][0]).toEqual(response)
    })

    it('should not be ipmacted by spaces between operands', () => {
        // Establish the mock objects for the test context
        const message = { channel: { send: jest.fn() } }
        const client = {}
        const command = 'roll'
        const args = ['2d20', '+', '10', '-', '5']

        Math.random = jest.fn().mockReturnValue(0.99)

        // Perform the action under test
        rollDice(client, message, command, args)

        // Verify that the result of the evaluation was correct
        const response = `**45**\n` +
            '\`\`\`' +
            `roll [20+20]+10-5\n` +
            `ask  2d20+10-5` +
            '\`\`\`'

        expect(Math.random.mock.calls.length).toBe(2)
        expect(message.channel.send.mock.calls.length).toBe(1)
        expect(message.channel.send.mock.calls[0][0]).toEqual(response)
    })
})