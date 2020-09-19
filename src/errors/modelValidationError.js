import CustomErrorBase from './customErrorBase';
import { ErrorCodes } from '../enums';

export default class ModelValidationError extends CustomErrorBase {
    constructor(message) {
        super();
        this.name = 'ModelValidationError';
        this.code = ErrorCodes.VALIDATION;
        this.message =
            message || 'An error has been occurred while validating!';
    }
}
