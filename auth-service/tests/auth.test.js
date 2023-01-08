const request = require('supertest');
const logger = require('../config/logger');
let app;

describe('POST /signup', () => {

    beforeEach(() => { app = require('../app'); })
    afterEach(async () => { 
      //app.close();
    });


    it('should signup a user', async () => {
        
        const usernamePass = {
            "username": "TestingUser",
            "password": "TestingPass"
        };
  
        const response = await request(app)
        .post('/auth/signup')
        .send(usernamePass)
        .set('Accept', 'application/json');

        console.log(response.body);
        console.log('\n\n\n\n');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('error', false);
        expect(response.body).toHaveProperty('message', "User created");
      });

});