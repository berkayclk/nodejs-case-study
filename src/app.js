import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import ejs from 'ejs';
import { logger, bindSwaggerDoc } from './helpers';
import { appConfig } from './config';
import './errors'; // set custom errors to global
import { Environments } from './enums';

import { ApiErrorResponse } from './api/models';
import { Record } from './routes';

// init express application
const app = express();
app.use(bodyParser.json());
app.use(cors());
if (appConfig.ENV !== Environments.TEST) {
    app.use(morgan('combined'));
}

// set view engine
// eslint-disable-next-line no-underscore-dangle
app.use(express.static(`${__dirname}/public`));
app.set('views', `${__dirname}/public/views`);
app.engine('.ejs', ejs.__express);
app.get('/', (req, res) => res.render('index.ejs'));

// define routes
app.use('/records', Record);
const SWAGGER_DOC_URL = bindSwaggerDoc(app); // binds swagger documentation to api-doc path

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
        .json(new ApiErrorResponse(error.code, error.message, SWAGGER_DOC_URL));
});

export default app;
