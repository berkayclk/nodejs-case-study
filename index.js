import './src/config/env.config';
import { appConfig } from './src/config';
import { connectMongo, logger } from './src/helpers';
import app from './src/app';

connectMongo();

app.listen(appConfig.APP_PORT, () => {
    logger.info(`App is running on ${appConfig.APP_PORT}`);
});
