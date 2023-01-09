const request = require('supertest');
const logger = require('../config/logger');
let app, server, agent;

describe('GET /timeline', () => {

    beforeEach((done) => {
      
      app = require('../app');
      server = app.listen(5000, (err) => {
        if (err) return done(err);
        agent = request.agent(server); // since the application is already listening, it should use the allocated port
        done();
      });
  
    })
    afterEach( (done) => { 
        return server && server.close(done);
    });

    it('should get timeline of a user', async () => {
        
        const username = "superuser";   //Fetches posts of username
        const authToken = "$2b$10$1IUlDi/2UNWOnn/eMHJkvuWe8m2fwkKNVQizPBEDEi33/.XYtHtCW";   // make sure a valid token

        var authHeaders = {"authorization": `Bearer ${authToken}`};

        const response = await agent.get(`/timeline`)
        .set(authHeaders);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('error', false);
        expect(response.body["posts"].length).toBeGreaterThanOrEqual(0);
      });

});