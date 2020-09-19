import mongoose from 'mongoose';
import { mongoConfig } from '../config';
import logger from './logger';

/**
 * Connects to mongodb with provided connectionString.
 * When the connectionString is not provided, MONGODB_URL env parameter will be used
 * @param connectionString {string}
 * @return {Promise<void>}
 */
export default async function connectMongo(connectionString) {
    const dbUrl =
        connectionString || mongoConfig.url || process.env.MONGODB_URL;

    if (!dbUrl) {
        logger.error('Mongodb connection url is not provided');
        return;
    }

    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.on('connected', () => {
        logger.info('Mongoose connection is opened');
    });

    mongoose.connection.on('error', (err) => {
        logger.error(`Mongoose connection has occurred error, ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('Mongoose connection is disconnected');
    });
}
