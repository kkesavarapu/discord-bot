import logger from 'winston'

// Configure the default logger from winston and export for use
logger.configure({
    level: 'debug',
    transports: [
        new logger.transports.Console({ colorize: true })
    ]
})

export default logger