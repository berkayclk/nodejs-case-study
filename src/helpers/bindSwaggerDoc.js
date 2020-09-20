import swaggerUi from 'swagger-ui-express';
import { openApiDocumentation } from '../config';
import logger from './logger';

export default (app, path = '/api-docs') => {
    app.use(path, swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
    logger.info(`Swagger doc is available on the "${path}" path`);
};
