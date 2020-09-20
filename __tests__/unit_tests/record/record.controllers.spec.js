import '../../../src/config/env.config';
import '../../../src/errors';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { findByDateAndCountRangesHandler } from '../../../src/api/components/record/record.controller';
import { ApiResponse } from '../../../src/api/models';
import connectMongo from '../../../src/helpers/connectMongo';

import Records from '../../../src/models/record'; // db model
import RecordSampleData from '../../data/record.sample'; // load sample data

const mongoServer = new MongoMemoryServer();
const resetRecordData = async () => {
    await Records.remove({}, { multi: true });
    await Records.create(RecordSampleData);
};

// connect to in-memory test db
beforeAll(async () => {
    const uri = await mongoServer.getUri();
    connectMongo(uri);
    resetRecordData();
});

describe('Record Controller Tests', () => {
    const callFunction = async (request) => {
        const next = jest.fn();
        const res = {
            json: jest.fn(),
        };

        await findByDateAndCountRangesHandler(request, res, next);

        return { next, res };
    };

    const validReq = {
        body: {
            startDate: '2015-05-15',
            endDate: '2015-05-15',
            minCount: 500,
            maxCount: 1500,
        },
    };

    describe('send valid body', () => {
        it('should not call next function when called valid body', async () => {
            const { next } = await callFunction(validReq);
            expect(next.mock.calls.length).toBe(0);
        });

        it('should call res.json 1 time when called valid body', async () => {
            const { res } = await callFunction(validReq);
            expect(res.json.mock.calls.length).toBe(1);
        });

        it('should call res.json with ApiResponse when called valid body', async () => {
            const { res } = await callFunction(validReq);

            expect(res.json.mock.calls.length).toBeGreaterThan(0);
            expect(res.json.mock.calls[0]).not.toBeNull();
            expect(res.json.mock.calls[0].length).toBe(1);
            expect(res.json.mock.calls[0][0]).toBeInstanceOf(ApiResponse);
        });

        it('should call res.json with 0 code when called valid body', async () => {
            const { res } = await callFunction(validReq);

            expect(res.json.mock.calls.length).toBeGreaterThan(0);
            expect(res.json.mock.calls[0]).not.toBeNull();
            expect(res.json.mock.calls[0].length).toBe(1);
            expect(res.json.mock.calls[0][0].code).toBe(0);
        });
    });

    describe('send invalid body', () => {
        it('should not call next function when body is empty', async () => {
            const { next } = await callFunction({ body: {} });
            expect(next.mock.calls.length).toBe(0);
        });

        it('should call res.json function 1 time when body is empty', async () => {
            const { res } = await callFunction({ body: {} });
            expect(res.json.mock.calls.length).toBe(1);
        });

        it('should call res.json function with ApiResponse when body is empty', async () => {
            const { res } = await callFunction({ body: {} });

            expect(res.json.mock.calls[0]).not.toBeNull();
            expect(res.json.mock.calls[0].length).toBe(1);
            expect(res.json.mock.calls[0][0]).toBeInstanceOf(ApiResponse);
        });

        it('should call res.json function with 0-record success response when body is empty', async () => {
            const { res } = await callFunction({ body: {} });
            expect(res.json.mock.calls[0][0].code).toBe(0);
            expect(res.json.mock.calls[0][0].msg).toBe('success');
            expect(res.json.mock.calls[0][0].records).not.toBeNull();
            expect(res.json.mock.calls[0][0].records.length).toBe(0);
        });
    });

    describe('Fetch records correctly', () => {
        beforeEach(resetRecordData);

        it('should return fields correctly of the records ', async () => {
            // should be fetch the any data
            const body = {
                startDate: '2010-01-01',
                endDate: '2020-12-31',
                minCount: 0,
                maxCount: Number.MAX_SAFE_INTEGER,
            };
            const { res } = await callFunction({ body });

            const { calls } = res.json.mock;
            expect(calls).not.toBeNull();
            expect(calls.length).toBe(1);
            expect(calls[0]).not.toBeNull();
            expect(calls[0].length).toBe(1);

            const responseBody = res.json.mock.calls[0][0];
            expect(responseBody).not.toBeNull();
            expect(responseBody.records).not.toBeNull();
            expect(responseBody.records.length).toBeGreaterThan(0);

            responseBody.records.forEach((data) => {
                expect(data.key).not.toBeNull();
                expect(data.createdAt).not.toBeNull();
                expect(data.totalCount).not.toBeNull();
            });
        });

        it('should return 2 records for the 2015 request', async () => {
            const body = {
                startDate: '2015-01-01',
                endDate: '2015-12-31',
                minCount: 0,
                maxCount: Number.MAX_SAFE_INTEGER,
            };
            const { res } = await callFunction({ body });

            const { calls } = res.json.mock;
            expect(calls).not.toBeNull();
            expect(calls.length).toBe(1);
            expect(calls[0]).not.toBeNull();
            expect(calls[0].length).toBe(1);

            const responseBody = res.json.mock.calls[0][0];

            expect(responseBody.records).not.toBeNull();
            expect(responseBody.records.length).toBe(2);
        });

        it('should return 1 records for 4250-4500 count range', async () => {
            const validKey = 'BGSENDtP'; // count:4374
            const body = {
                startDate: '2010-01-01',
                endDate: '2020-12-31',
                minCount: 4250,
                maxCount: 4500,
            };
            const { res } = await callFunction({ body });

            const responseBody = res.json.mock.calls[0][0];

            expect(responseBody.records).not.toBeNull();
            expect(responseBody.records.length).toBe(1);
            expect(responseBody.records[0].key).toBe(validKey);
        });

        it('should return 1 records for date-count combination', async () => {
            const validKey = 'gzdulvOE'; // count: 3873, date: 2016-07-02
            const body = {
                startDate: '2016-07-01',
                endDate: '2016-07-30',
                minCount: 3500,
                maxCount: 4000,
            };

            const { res } = await callFunction({ body });
            const responseBody = res.json.mock.calls[0][0];

            expect(responseBody.records).not.toBeNull();
            expect(responseBody.records.length).toBe(1);
            expect(responseBody.records[0].key).toBe(validKey);
        });

        it('should return records that are inside of the endDate', async () => {
            const validKey = 'gzdulvOE'; // count: 3873, date: 2016-07-02T16:16:03.540
            const body = {
                startDate: '2016-07-01',
                endDate: '2016-07-02',
                minCount: 3800,
                maxCount: 3900,
            };

            const { res } = await callFunction({ body });
            const responseBody = res.json.mock.calls[0][0];

            expect(responseBody.records).not.toBeNull();
            expect(responseBody.records.length).toBe(1);
            expect(responseBody.records[0].key).toBe(validKey);
        });
    });

    describe('Error Cases', () => {
        it('should call next function with UnexpectedError when body is null', async () => {
            const { next } = await callFunction({});

            expect(next.mock.calls.length).toBe(1);
            expect(next.mock.calls[0]).not.toBeNull();
            expect(next.mock.calls[0].length).toBe(1);
            expect(next.mock.calls[0][0]).toBeInstanceOf(UnexpectedError);
        });
    });
});
