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


      it('should create a Post', async () => {
        
        const username = "newuser";   //Fetches posts of username
        const authToken = "$2b$10$Jd8q9ao9w//v7iycRTg2Y.f5wJAMioDDrNcl7/gwpbvDOKU89M7mK";   // make sure a valid token

        var authHeaders = {"authorization": `Bearer ${authToken}`};

        const usernamePass = {
            "post": `How come people suffer? How come people part?
            How come people struggle? How come people break your heart?
            Break your heart?
            Yes I wanna grow, yes I want to feel
            Yes I wanna know, show me how to heal it up
            Heal it up`,
            "tags": ""          //empty for now
        };

        const response = await agent.post(`/timeline/addPost/`)
        .set(authHeaders)
        .send(usernamePass);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('error', false);
        expect(response.body).toHaveProperty('message', 'Created');
      });

});