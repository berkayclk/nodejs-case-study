import subertest from 'supertest';
import app from '../../src/app';

describe('Not Existing Path Requests', () => {
    const path = '/records/not-existing-path-url';

    const postRequest = () => subertest(app).post(path).send();

    it('should return 404 http code', async () => {
        postRequest().expect(404);
    });

    it('should return 3 response code in body', async () => {
        const respom = await postRequest();
        expect(respom).not.toBeNull();
        expect(respom.body.code).toBe(3);
    });

    it('should return Not Found! response msg in body', async () => {
        const response = await postRequest();
        expect(response).not.toBeNull();
        expect(response.body.msg).toBe('Not Found!');
    });

    it('should return apiDocUrl in body', async () => {
        const response = await postRequest();
        expect(response).not.toBeNull();
        expect(response.body.apiDocUrl).not.toBeNull();
    });
});
