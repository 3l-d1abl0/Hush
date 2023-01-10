const request = require('supertest');
const logger = require('../config/logger');
let app, server, agent;

describe('POST /follow', () => {

    beforeEach((done) => {
      
      app = require('../app');
      server = app.listen(6000, (err) => {
        if (err) return done(err);
        agent = request.agent(server); // since the application is already listening, it should use the allocated port
        done();
      });
  
    })
    afterEach( (done) => { 
        return server && server.close(done);
    });

    it('should allow user to follow another user', async () => {
        
        const usernametoFollow = "superuser";   //Fetches posts of username
        const authToken = "$2b$10$OY6Se/dSNgzYdSLvAJHRSO9hf9Ske.4XL1gP.nFW1FFLrwifrOKvO";   // make sure a valid token

        var authHeaders = {"authorization": `Bearer ${authToken}`};

        const reqBody = {
            "username": `${usernametoFollow}`
        };

        const response = await agent.post(`/follow`)
        .set(authHeaders)
        .send(reqBody);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('error', false);
        expect(response.body).toHaveProperty('message', 'Followed');
      });

});