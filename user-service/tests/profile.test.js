const request = require('supertest');
const logger = require('../config/logger');
let app, server, agent;

describe('GET /profile', () => {

    beforeEach((done) => {
      
      app = require('../app');
      server = app.listen(4000, (err) => {
        if (err) return done(err);
        agent = request.agent(server); // since the application is already listening, it should use the allocated port
        done();
      });
  
    })
    afterEach( (done) => { 
        return server && server.close(done);
    });

    it('should get profile of a user', async () => {
        
        const username = "superuser";   //Fetches posts of username
        const authToken = "$2b$10$Cr4o4AjlxfCi9kEFgAIkRujCKvpRm48q2HVb5.EHnK3NDQOAX2C5C";   // make sure a valid token

        var authHeaders = {"authorization": `Bearer ${authToken}`};

        const response = await agent.get(`/profile/${username}`)
        .set(authHeaders);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('error', false);
        expect(response.body["posts"].length).toBeGreaterThanOrEqual(0);
      });


      it('should fail to get profile of a user', async () => {
        
        const username = "superuser";   //Fetches posts of username
        const authToken = "sameInvalidToken";   // make sure a valid token

        var authHeaders = {"authorization": `Bearer ${authToken}`};

        const response = await agent.get(`/profile/${username}`)
        .set(authHeaders);
        
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', true);
        expect(response.body).toHaveProperty('message', 'User not found!');
      });
});