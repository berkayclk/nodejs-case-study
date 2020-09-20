import swaggerUi from 'swagger-ui-express';
import { openApiDocumentation, appConfig } from '../config';
import logger from './logger';

/**
 * Sets swagger-ui middleware to app and returns api-docs url
 * @param app -- express app
 * @param path -- api doc path
 * @return {string} -- api doc url
 */
export default (app, path = '/api-docs') => {
    app.use(path, swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
    const swaggerDocUrl = appConfig.APP_URL
        ? `${appConfig.APP_URL}${path}`
        : `http://localhost:${appConfig.APP_PORT}${path}`;

    logger.info(`Swagger doc is available on ${swaggerDocUrl}`);

    return swaggerDocUrl;
};
