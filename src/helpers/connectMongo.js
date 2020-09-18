import mongoose from 'mongoose';
import { mongoConfig } from '../config';

export default async function connectMongo() {
    const dbUrl = `mongodb+srv://${mongoConfig.host}/${mongoConfig.db}?retryWrites=true`;

    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: mongoConfig.user,
        pass: mongoConfig.pass,
    });

    mongoose.connection.on('connected', () => {
        console.log(
            `Mongoose connection is open to ${mongoConfig.host}/${mongoConfig.db}`
        );
    });

    mongoose.connection.on('error', (err) => {
        console.log(`Mongoose connection has occurred error, ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose connection is disconnected');
    });
}
