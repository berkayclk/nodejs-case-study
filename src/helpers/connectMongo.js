import mongoose from 'mongoose';
import { mongoConfig } from '../config';
import logger from './logger';

export default async function connectMongo() {
    const dbUrl = `mongodb+srv://${mongoConfig.host}/${mongoConfig.db}?retryWrites=true`;

    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: mongoConfig.user,
        pass: mongoConfig.pass,
    });

    mongoose.connection.on('connected', () => {
        logger.info(
            `Mongoose connection is open to ${mongoConfig.host}/${mongoConfig.db}`
        );
    });

    mongoose.connection.on('error', (err) => {
        logger.error(`Mongoose connection has occurred error, ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('Mongoose connection is disconnected');
    });
}
