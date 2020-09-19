import '../../../src/config/env.config';
import '../../../src/errors';
import _ from 'lodash';
import { validateDateAndCountRange } from '../../../src/api/components/record/record.middleware';

describe('Record Middleware Tests', () => {
    const validReq = {
        body: {
            startDate: '2015-05-15',
            endDate: '2015-05-15',
            minCount: 500,
            maxCount: 1500,
        },
    };

    describe('send valid body', () => {
        it('should call next function with 0 arguments when called valid body', async () => {
            const next = jest.fn();

            await validateDateAndCountRange(validReq, {}, next);

            expect(next).nthCalledWith(1);
        });
    });
    describe('send invalid body', () => {
        it('should call next with ValidationError when body is empty', async () => {
            const next = jest.fn();

            await validateDateAndCountRange({ body: {} }, {}, next);

            expect(next.mock.calls.length).toBe(1);
            expect(next).lastCalledWith(
                new ModelValidationError('"startDate" is required')
            );
        });

        it('should call next with ValidationError when startDate is missing', async () => {
            const next = jest.fn();

            const invalidReq = _.cloneDeep(validReq);
            delete invalidReq.body.startDate;

            await validateDateAndCountRange(invalidReq, {}, next);

            expect(next.mock.calls.length).toBe(1);
            expect(next).lastCalledWith(
                new ModelValidationError('"startDate" is required')
            );
        });
        it('should call next with ValidationError when startDate is not iso format', async () => {
            const next = jest.fn();

            const invalidReq = _.cloneDeep(validReq);
            invalidReq.body.startDate = 'wrong-format';

            await validateDateAndCountRange(invalidReq, {}, next);

            expect(next.mock.calls.length).toBe(1);
            expect(next).lastCalledWith(
                new ModelValidationError('"startDate" must be in iso format')
            );
        });

        it('should call next with ValidationError when endDate is missing', async () => {
            const next = jest.fn();

            const invalidReq = _.cloneDeep(validReq);
            delete invalidReq.body.endDate;

            await validateDateAndCountRange(invalidReq, {}, next);

            expect(next.mock.calls.length).toBe(1);
            expect(next).lastCalledWith(
                new ModelValidationError('"endDate" is required')
            );
        });
        it('should call next with ValidationError when endDate is not iso format', async () => {
            const next = jest.fn();

            const invalidReq = _.cloneDeep(validReq);
            invalidReq.body.endDate = 'wrong-format';

            await validateDateAndCountRange(invalidReq, {}, next);

            expect(next.mock.calls.length).toBe(1);
            expect(next).lastCalledWith(
                new ModelValidationError('"endDate" must be in iso format')
            );
        });

        it('should call next with ValidationError when minCount is missing', async () => {
            const next = jest.fn();

            const invalidReq = _.cloneDeep(validReq);
            delete invalidReq.body.minCount;

            await validateDateAndCountRange(invalidReq, {}, next);

            expect(next.mock.calls.length).toBe(1);
            expect(next).lastCalledWith(
                new ModelValidationError('"minCount" is required')
            );
        });
        it('should call next with ValidationError when minCount is not number format', async () => {
            const next = jest.fn();

            const invalidReq = _.cloneDeep(validReq);
            invalidReq.body.minCount = 'wrong-format';

            await validateDateAndCountRange(invalidReq, {}, next);

            expect(next.mock.calls.length).toBe(1);
            expect(next).lastCalledWith(
                new ModelValidationError('"minCount" must be a number')
            );
        });

        it('should call next with ValidationError when maxCount is missing', async () => {
            const next = jest.fn();

            const invalidReq = _.cloneDeep(validReq);
            delete invalidReq.body.maxCount;

            await validateDateAndCountRange(invalidReq, {}, next);

            expect(next.mock.calls.length).toBe(1);
            expect(next).lastCalledWith(
                new ModelValidationError('"maxCount" is required')
            );
        });
        it('should call next with ValidationError when maxCount is not iso format', async () => {
            const next = jest.fn();

            const invalidReq = _.cloneDeep(validReq);
            invalidReq.body.maxCount = 'wrong-format';

            await validateDateAndCountRange(invalidReq, {}, next);

            expect(next.mock.calls.length).toBe(1);
            expect(next).lastCalledWith(
                new ModelValidationError('"maxCount" must be a number')
            );
        });
    });
});
