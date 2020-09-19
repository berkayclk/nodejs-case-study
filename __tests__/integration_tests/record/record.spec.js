import '../../../src/config/env.config';
import subertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../../src/app';
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
    return connectMongo(uri);
});

describe('Records fetching operations', () => {
    const path = '/records/findByDateAndCount';
    const validBody = {
        startDate: '2015-05-15',
        endDate: '2015-05-15',
        minCount: 500,
        maxCount: 1500,
    };

    const postRecordRequest = (body) => subertest(app).post(path).send(body);

    describe('Successfully fetching records', () => {
        it('should return 200 http response code', async () => {
            return postRecordRequest(validBody).expect(200);
        });

        it('should have code and msg in body', async () => {
            const response = await postRecordRequest(validBody);
            expect(response).not.toBeNull();
            expect(response.body).not.toBeNull();
            expect(response.body.code).not.toBeNull();
            expect(response.body.msg).not.toBeNull();
        });

        it('should return 0 response code in body', async () => {
            const response = await postRecordRequest(validBody);
            expect(response.body.code).toBe(0);
        });

        it('should return "success" msg in body"', async () => {
            const response = await postRecordRequest(validBody);
            expect(response.body.msg).toBe('success');
        });

        it('should return "success" msg in body"', async () => {
            const response = await postRecordRequest(validBody);
            expect(response.body.msg).toBe('success');
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
            const response = await postRecordRequest(body);
            expect(response.body.records).not.toBeNull();
            expect(response.body.records.length).toBeGreaterThan(0);

            response.body.records.forEach((data) => {
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
            const response = await postRecordRequest(body);
            expect(response.body.records).not.toBeNull();
            expect(response.body.records.length).toBe(2);
        });

        it('should return 2 records for the 2015 request', async () => {
            const body = {
                startDate: '2015-01-01',
                endDate: '2015-12-31',
                minCount: 0,
                maxCount: Number.MAX_SAFE_INTEGER,
            };
            const response = await postRecordRequest(body);
            expect(response.body.records).not.toBeNull();
            expect(response.body.records.length).toBe(2);
        });

        it('should return 1 records for 4250-4500 count range', async () => {
            const validKey = 'BGSENDtP'; // count:4374
            const body = {
                startDate: '2010-01-01',
                endDate: '2020-12-31',
                minCount: 4250,
                maxCount: 4500,
            };
            const response = await postRecordRequest(body);
            expect(response.body.records).not.toBeNull();
            expect(response.body.records.length).toBe(1);
            expect(response.body.records[0].key).toBe(validKey);
        });

        it('should return 1 records for date-count combination', async () => {
            const validKey = 'gzdulvOE'; // count: 3873, date: 2016-07-02
            const body = {
                startDate: '2016-07-01',
                endDate: '2016-07-30',
                minCount: 3500,
                maxCount: 4000,
            };
            const response = await postRecordRequest(body);
            expect(response.body.records).not.toBeNull();
            expect(response.body.records.length).toBe(1);
            expect(response.body.records[0].key).toBe(validKey);
        });

        it('should return records inside of the endDate', async () => {
            const validKey = 'gzdulvOE'; // count: 3873, date: 2016-07-02T16:16:03.540
            const body = {
                startDate: '2016-07-01',
                endDate: '2016-07-02',
                minCount: 3800,
                maxCount: 3900,
            };
            const response = await postRecordRequest(body);
            expect(response.body.records).not.toBeNull();
            expect(response.body.records.length).toBe(1);
            expect(response.body.records[0].key).toBe(validKey);
        });
    });

    describe('Validation testing', () => {
        it('should return 400 http response code for empty body', async () => {
            return postRecordRequest({}).expect(400);
        });

        describe('startDate field missing validation', () => {
            const startDateMissingBody = { ...validBody, startDate: undefined };
            it('should return 400 http response code when startDate is missing', async () => {
                return postRecordRequest(startDateMissingBody).expect(400);
            });

            it('should return 2 response code when startDate is missing', async () => {
                const response = await postRecordRequest(startDateMissingBody);
                expect(response.body.code).toBe(2);
            });

            it('should return error message when startDate is missing', async () => {
                const response = await postRecordRequest(startDateMissingBody);
                expect(response.body.msg).toBe('"startDate" is required');
            });

            it('should return empty records array when startDate is missing', async () => {
                const response = await postRecordRequest(startDateMissingBody);
                expect(response.body.records).not.toBeNull();
                expect(response.body.records.length).toBe(0);
            });
        });
        describe('sending startDate field in wrong format', () => {
            const wrongStartDateBody = {
                ...validBody,
                startDate: 'test-wrong-format',
            };

            it('should return 400 http response code for wrong startDate format', async () => {
                return postRecordRequest(wrongStartDateBody).expect(400);
            });

            it('should return 2 response code for wrong startDate format', async () => {
                const response = await postRecordRequest(wrongStartDateBody);
                expect(response.body.code).toBe(2);
            });

            it('should return empty records array for wrong startDate format', async () => {
                const response = await postRecordRequest(wrongStartDateBody);
                expect(response.body.records).not.toBeNull();
                expect(response.body.records.length).toBe(0);
            });

            it('should return error message for wrong startDate format', async () => {
                const response = await postRecordRequest(wrongStartDateBody);
                expect(response.body.msg).toBe(
                    '"startDate" must be in iso format'
                );
            });
        });

        describe('endDate field missing validation', () => {
            const endDateMissingBody = { ...validBody, endDate: undefined };
            it('should return 400 http response code when endDate is missing', async () => {
                return postRecordRequest(endDateMissingBody).expect(400);
            });

            it('should return 2 response code when endDate is missing', async () => {
                const response = await postRecordRequest(endDateMissingBody);
                expect(response.body.code).toBe(2);
            });

            it('should return error message when endDate is missing', async () => {
                const response = await postRecordRequest(endDateMissingBody);
                expect(response.body.msg).toBe('"endDate" is required');
            });

            it('should return empty records array when endDate is missing', async () => {
                const response = await postRecordRequest(endDateMissingBody);
                expect(response.body.records).not.toBeNull();
                expect(response.body.records.length).toBe(0);
            });
        });
        describe('sending endDate field in wrong format', () => {
            const wrongEndDateBody = {
                ...validBody,
                endDate: 'test-wrong-format',
            };

            it('should return 400 http response code for wrong endDate format', async () => {
                return postRecordRequest(wrongEndDateBody).expect(400);
            });

            it('should return 2 response code for wrong endDate format', async () => {
                const response = await postRecordRequest(wrongEndDateBody);
                expect(response.body.code).toBe(2);
            });

            it('should return empty records array for wrong endDate format', async () => {
                const response = await postRecordRequest(wrongEndDateBody);
                expect(response.body.records).not.toBeNull();
                expect(response.body.records.length).toBe(0);
            });

            it('should return error message for wrong endDate format', async () => {
                const response = await postRecordRequest(wrongEndDateBody);
                expect(response.body.msg).toBe(
                    '"endDate" must be in iso format'
                );
            });
        });

        describe('minCount field missing validation', () => {
            const minCountMissingBody = { ...validBody, minCount: undefined };
            it('should return 400 http response code when minCount is missing', async () => {
                return postRecordRequest(minCountMissingBody).expect(400);
            });

            it('should return 2 response code when minCount is missing', async () => {
                const response = await postRecordRequest(minCountMissingBody);
                expect(response.body.code).toBe(2);
            });

            it('should return error message when minCount is missing', async () => {
                const response = await postRecordRequest(minCountMissingBody);
                expect(response.body.msg).toBe('"minCount" is required');
            });

            it('should return empty records array when minCount is missing', async () => {
                const response = await postRecordRequest(minCountMissingBody);
                expect(response.body.records).not.toBeNull();
                expect(response.body.records.length).toBe(0);
            });
        });
        describe('sending minCount field in wrong format', () => {
            const wrongMinCountBody = {
                ...validBody,
                minCount: 'test-wrong-format',
            };

            it('should return 400 http response code for wrong minCount format', async () => {
                return postRecordRequest(wrongMinCountBody).expect(400);
            });

            it('should return 2 response code for wrong minCount format', async () => {
                const response = await postRecordRequest(wrongMinCountBody);
                expect(response.body.code).toBe(2);
            });

            it('should return empty records array for wrong minCount format', async () => {
                const response = await postRecordRequest(wrongMinCountBody);
                expect(response.body.records).not.toBeNull();
                expect(response.body.records.length).toBe(0);
            });

            it('should return error message for wrong minCount format', async () => {
                const response = await postRecordRequest(wrongMinCountBody);
                expect(response.body.msg).toBe('"minCount" must be a number');
            });
        });

        describe('maxCount field missing validation', () => {
            const maxCountMissingBody = { ...validBody, maxCount: undefined };
            it('should return 400 http response code when maxCount is missing', async () => {
                return postRecordRequest(maxCountMissingBody).expect(400);
            });

            it('should return 2 response code when maxCount is missing', async () => {
                const response = await postRecordRequest(maxCountMissingBody);
                expect(response.body.code).toBe(2);
            });

            it('should return error message when maxCount is missing', async () => {
                const response = await postRecordRequest(maxCountMissingBody);
                expect(response.body.msg).toBe('"maxCount" is required');
            });

            it('should return empty records array when maxCount is missing', async () => {
                const response = await postRecordRequest(maxCountMissingBody);
                expect(response.body.records).not.toBeNull();
                expect(response.body.records.length).toBe(0);
            });
        });
        describe('sending maxCount field in wrong format', () => {
            const wrongMaxCountBody = {
                ...validBody,
                maxCount: 'test-wrong-format',
            };

            it('should return 400 http response code for wrong maxCount format', async () => {
                return postRecordRequest(wrongMaxCountBody).expect(400);
            });

            it('should return 2 response code for wrong maxCount format', async () => {
                const response = await postRecordRequest(wrongMaxCountBody);
                expect(response.body.code).toBe(2);
            });

            it('should return empty records array for wrong maxCount format', async () => {
                const response = await postRecordRequest(wrongMaxCountBody);
                expect(response.body.records).not.toBeNull();
                expect(response.body.records.length).toBe(0);
            });

            it('should return error message for wrong maxCount format', async () => {
                const response = await postRecordRequest(wrongMaxCountBody);
                expect(response.body.msg).toBe('"maxCount" must be a number');
            });
        });
    });
});
