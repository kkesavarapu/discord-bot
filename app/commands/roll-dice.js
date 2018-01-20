// The full set of arguments are assembled into a message with this
// command and assumed to be just the roll formula. The formula is
// then parsed into a directed graph and evaluated recursively to
// arrive at a result as well as the 'work' to show how the result
// was achieved
//
// 3d10+5+1d4
// [1d10 + 1d10 + 1d10] + 5 + r2
// [r3 + r5 + r1] + 5 + r2
// 16
//
// Decisions
// - Operator precedence: +, -, d
// - Unknown parse pattern evaluated to 0


// Recursive Cases //////
// Breaks up all the operands being summed together and resolve them
// recursively
const sum = (exp) => {
    let operands = exp.split('+')
    let evaluations = operands.map(o => evaluate(o))

    let value = evaluations.reduce((a, c) => a + c.value, 0)
    let work = evaluations.map(e => e.work).join('+')

    return { value, work }
}

// Breaks up all the operands being subtracted and resolves them
// recursively
const subtract = (exp) => {
    let operands = exp.split('-')
    let evaluations = operands.map(o => evaluate(o))

    // Set the initial value to twice the first number so the subtractions
    // can be accumulated. Example: [5, 4, 3, 2, 1] --> 10-5-4-3-2-1
    let value = evaluations.reduce((a, c) => a - c.value, evaluations[0].value * 2)
    let work = evaluations.map(e => e.work).join('-')

    return { value, work }
}

// Expands multiple dice rolls (i.e. 3d10) into individual dice rolls
// and adds the results together (i.e. 1d10+1d10+1d10)
const dice = (exp) => {
    let operands = exp.split('d')
    let diceCount = parseInt(operands[0])
    let diceSides = parseInt(operands[1])

    // For the number of dice found, create that many single dice rolls
    let evaluations = [...Array(diceCount).keys()]
        .map(o => evaluate('1d' + diceSides))

    let value = evaluations.reduce((a, c) => a + c.value, 0)
    let work = '[' + evaluations.map(e => e.work).join('+') + ']'

    return { value, work }
}

const recursive = {
    sum: sum,
    subtract: subtract,
    dice: dice
}

// Base Cases //////
// A roll of a single dice of indeterminate sides
const roll = (exp) => {
    const diceFaces = parseInt(exp.slice(2))
    const diceRoll = Math.floor(Math.random() * diceFaces + 1)
    return { value: diceRoll, work: diceRoll }
}

// An integer is an integer is an integer
const numeric = (exp) => ({ value: parseInt(exp), work: parseInt(exp) })

// Nothing to do. Literally.
const noOp = () => ({ value: 0, work: '' })

const base = {
    roll: roll,
    numeric: numeric,
    noOp: noOp
}

const evaluate = (exp) => {

    // -- Recursive Cases --
    // If the expression has additions, then evaluate those first
    if (/^.+\+.+$/.test(exp)) return recursive.sum(exp)

    // If the expression has subtractions, then evaluate those
    if (/^.+\-.+$/.test(exp)) return recursive.subtract(exp)

    // If the expression has multiple dice rolls, then evaluate those
    if (/([2-9]|[0-9]{2,})d([0-9]+)/.test(exp)) return recursive.dice(exp)

    // -- Base Cases --
    // If the pattern matches a single dice roll, roll it as a result
    if (/^(1?)d([0-9]+)$/.test(exp)) return base.roll(exp)

    // If the pattern matches an integer, return it as the result
    if (/^-?[0-9]+$/.test(exp)) return base.numeric(exp)

    // If no other cases match, return the default result
    return base.noOp()

}

export default (client, message, command, args) => {
    // Determine which commands to respond to and ignore the rest
    if (!['roll', 'r'].includes(command)) return

    // Join the arguments into a complete message to represent the
    // formula to parse
    const formula = args.join('').toLowerCase()
    const result = evaluate(formula)

    message.channel.send(`**${result.value}**\n` +
        '\`\`\`' +
        `roll ${result.work}\n` +
        `ask  ${formula}` +
        '\`\`\`')
}