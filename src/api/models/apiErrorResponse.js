import ApiResponse from './apiResponse';

export default class ApiErrorResponse extends ApiResponse {
    constructor(code = 1, message = 'error', apiDocUrl = null) {
        super([], code, message);
        this.apiDocUrl = apiDocUrl;
    }
}
