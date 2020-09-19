import CustomErrorBase from './customErrorBase';
import { ErrorCodes } from '../enums';

export default class UnexpectedError extends CustomErrorBase {
    constructor(error) {
        super();
        this.name = 'UnexpectedError';
        this.code = ErrorCodes.UNEXPECTED;
        this.message = 'An error has been occurred!';
        this.originalError = error;
    }
}
