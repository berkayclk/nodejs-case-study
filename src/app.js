import express from 'express';
import bodyParser from 'body-parser';

import { ApiResponse } from './api/models';
import { Record } from './routes';

// init express application
const app = express();
app.use(bodyParser.json());

app.use('/records', Record);

/**
 * handle not mapped url error
 */
app.use((req, res, next) => {
    const error = new Error('Wrong path!');
    error.code = 404;
    error.httpCode = 404;
    next(error);
});

/**
 * handle all errors is sent by next functions
 */
app.use((err, req, res) => {
    const code = err.code || 400;
    const httpCode = err.httpCode || 404;
    return res.status(httpCode).json(new ApiResponse([], code, err.message));
});

export default app;
