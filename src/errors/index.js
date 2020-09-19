import CustomErrorBase from './customErrorBase';
import UnexpectedError from './unexpectedError';
import ModelValidationError from './modelValidationError';
import NotFoundError from './notFoundError';

global.CustomErrorBase = CustomErrorBase;
global.UnexpectedError = UnexpectedError;
global.ModelValidationError = ModelValidationError;
global.NotFoundError = NotFoundError;
