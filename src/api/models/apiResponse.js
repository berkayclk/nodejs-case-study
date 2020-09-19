export default class ApiResponse {
    constructor(records, code = 0, message = 'success') {
        this.records = records;
        this.code = code;
        this.msg = message;
    }
}
