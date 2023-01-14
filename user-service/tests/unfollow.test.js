const request = require('supertest');
const logger = require('../config/logger');
let app, server, agent;

describe('POST /unfollow', () => {

    beforeEach((done) => {
      
      app = require('../app');
      server = app.listen(4000, (err) => {
        if (err) return done(err);
        agent = request.agent(server); 
        done();
      });
  
    })
    afterEach( (done) => { 
        return server && server.close(done);
    });

    it('should allow user to unfollow another user', async () => {
        
        const usernametoFollow = "superuser";   //valid username to unfollow
        const authToken = "$2b$10$OY6Se/dSNgzYdSLvAJHRSO9hf9Ske.4XL1gP.nFW1FFLrwifrOKvO";   // make sure a valid token

        var authHeaders = {"authorization": `Bearer ${authToken}`};

        const reqBody = {
            "username": `${usernametoFollow}`
        };

        //Make Sure the user is following the other User
        const followResponse = await agent.post(`/follow`)
        .set(authHeaders)
        .send(reqBody);

        const response = await agent.post(`/unfollow`)
        .set(authHeaders)
        .send(reqBody);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('error', false);
        expect(response.body).toHaveProperty('message', 'Unfollowed');
    });

    it('should be unable to unfollow already unfollowed user', async () => {
        
      const usernametoFollow = "superuser";   //valid username to unfollow
      const authToken = "$2b$10$OY6Se/dSNgzYdSLvAJHRSO9hf9Ske.4XL1gP.nFW1FFLrwifrOKvO";   // make sure a valid token

      var authHeaders = {"authorization": `Bearer ${authToken}`};

      const reqBody = {
          "username": `${usernametoFollow}`
      };

      const response = await agent.post(`/unfollow`)
      .set(authHeaders)
      .send(reqBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Already unfollowed');
    });

    it('should be unable to unfollow non-existent users', async () => {
        
      const usernametoFollow = "nonexistentusername";   //nonexistent username
      const authToken = "$2b$10$OY6Se/dSNgzYdSLvAJHRSO9hf9Ske.4XL1gP.nFW1FFLrwifrOKvO";   // make sure a valid token

      var authHeaders = {"authorization": `Bearer ${authToken}`};

      const reqBody = {
          "username": `${usernametoFollow}`
      };

      const response = await agent.post(`/unfollow`)
      .set(authHeaders)
      .send(reqBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Already unfollowed');
    });
    
});