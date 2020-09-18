import express from 'express';
import bodyParser from 'body-parser';

// init express application
const app = express();
app.use(bodyParser.json());

export default app;
