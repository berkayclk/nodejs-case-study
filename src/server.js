import { appConfig } from './config';
import app from './app';

app.listen(appConfig.APP_PORT, () => {
    console.log(`App is running on ${appConfig.APP_PORT}`);
});
