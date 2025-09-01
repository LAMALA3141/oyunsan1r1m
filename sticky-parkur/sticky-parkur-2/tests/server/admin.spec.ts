import request from 'supertest';
import { app } from '../../server/index'; // Adjust the path as necessary
import { AccessCode } from '../models/accessCode.model'; // Adjust the path as necessary

describe('Admin Panel Access Codes', () => {
    beforeAll(async () => {
        // Setup code to connect to the database and seed initial data if necessary
    });

    afterAll(async () => {
        // Cleanup code to disconnect from the database
    });

    it('should validate access code for level access', async () => {
        const response = await request(app)
            .post('/admin/validate-access-code')
            .send({ code: 'LEVEL_ACCESS_CODE' }); // Replace with actual access code

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('valid', true);
    });

    it('should grant infinite money with the correct access code', async () => {
        const response = await request(app)
            .post('/admin/validate-access-code')
            .send({ code: 'INFINITE_MONEY_CODE' }); // Replace with actual access code

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('infiniteMoney', true);
    });

    it('should return invalid for incorrect access code', async () => {
        const response = await request(app)
            .post('/admin/validate-access-code')
            .send({ code: 'INVALID_CODE' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('valid', false);
    });
});