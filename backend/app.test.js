// Importing Supertest for making http requests
const request = require('supertest');

const { app, db } = require('./app');

// To clean the test database after the testing
const fs = require('fs');

const testDbFile = './ecomstore.test.db';

// When all tests are finished
afterAll((done) => {
  
  db.close((err) => {
    if (err) console.error(err.message);
    
    // Deleting the test database file
    fs.unlink(testDbFile, (err) => {
      if (err) console.error(err.message);
      
      console.log('Test database file successfully deleted.');
      
      done();
    });
  });
})

// Testing the /api/products API endpoint
describe('Products API', () => {
  
  it('should GET all the products present in the database', async () => {
    
    const res = await request(app)
      .get('/api/products')
      .expect(200) // Expecting a 200 OK status
      .expect('Content-Type', /json/); // Expecting a JSON response
    
    expect(res.body).toBeInstanceOf(Array);
    
    // Checking our mock data is in response or not
    expect(res.body.length).toBe(5);
    expect(res.body[0].name).toBe('Vintage T-Shirt');
  })
});