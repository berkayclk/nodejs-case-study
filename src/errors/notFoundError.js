import CustomErrorBase from './customErrorBase';
import { ErrorCodes } from '../enums';

export default class NotFoundError extends CustomErrorBase {
    constructor(message) {
        super();
        this.name = 'NotFoundError';
        this.code = ErrorCodes.NOT_FOUND;
        this.httpCode = 404;
        this.message = message || 'Not Found!';
    }
}
