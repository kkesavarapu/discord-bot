import logger from './logging'

export default (context) => (err) => {
    logger.error(context, 'with', err)
}