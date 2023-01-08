const request = require('supertest');
const logger = require('../config/logger');
let app;

describe('GET /profile', () => {

    beforeEach(() => { app = require('../app'); })
    afterEach(async () => { 
      //app.close();
    });

    it('should get profile of a user', async () => {
        
        const username = "superuser";   //Fetches posts of username
        const authToken = "$2b$10$Cr4o4AjlxfCi9kEFgAIkRujCKvpRm48q2HVb5.EHnK3NDQOAX2C5C";   // make sure a valid token

        var authHeaders = {"authorization": `Bearer ${authToken}`};

        const response = await request(app)
        .get(`/profile/${username}`)
        .set(authHeaders);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('error', false);
        expect(response.body["posts"].length).toBeGreaterThanOrEqual(0);
      });

});