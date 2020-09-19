import winston from 'winston';
import { Environments } from '../enums';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        // todo: integrate cloudwatch transport etc.
    ],
});

if (
    process.env.NODE_ENV !== Environments.PROD ||
    logger.transports.length === 0
) {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

global.logger = logger;
export default logger;
