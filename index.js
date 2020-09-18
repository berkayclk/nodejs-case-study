import app from './src/app';
import { appConfig } from './src/config';
import { connectMongo } from './src/helpers';

connectMongo();

app.listen(appConfig.APP_PORT, () => {
    console.log(`App is running on ${appConfig.APP_PORT}`);
});
