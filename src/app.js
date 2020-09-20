import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { logger, bindSwaggerDoc } from './helpers';
import { appConfig } from './config';
import './errors'; // set custom errors to global
import { Environments } from './enums';

import { ApiResponse } from './api/models';
import { Record } from './routes';

// init express application
const app = express();
app.use(bodyParser.json());
app.use(cors());
if (appConfig.ENV !== Environments.TEST) {
    app.use(morgan('dev'));
}

// define routes
app.use('/records', Record);
bindSwaggerDoc(app); // binds swagger documentation to api-doc path

/**
 * handle not mapped url error
 */
app.use((req, res, next) => {
    // eslint-disable-next-line no-undef
    const error = new NotFoundError();
    next(error);
});

/**
 * handle all errors is sent by next functions
 */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    logger.error(err);
    let error = err;
    if (!(error instanceof CustomErrorBase)) {
        error = new UnexpectedError();
    }

    return res
        .status(error.httpCode)
        .json(new ApiResponse([], error.code, error.message));
});

export default app;
