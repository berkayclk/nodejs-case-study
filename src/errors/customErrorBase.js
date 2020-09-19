import { ErrorCodes } from '../enums';

export default class CustomErrorBase extends Error {
    constructor(props) {
        super(props);
        this.name = 'CustomErrorBase';
        this.code = ErrorCodes.UNEXPECTED;
        this.httpCode = 400;
        if (this.constructor === CustomErrorBase) {
            throw new Error('Custom Error is abstract error class');
        }
    }
}
