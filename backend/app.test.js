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

// Testing the /api/cart API Endpoint
describe('Cart API tests', () => {
  
  // Adding item to the Cart
  it('should POST an item to /api/cart', async () => {
    
    const res = await request(app)
      .post('/api/cart')
      .send({ productId: 1, quantity: 2 }) // A test payload
      .expect(201);
    
    expect(res.body.message).toBe('Item added to the cart');
    expect(res.body.id).toBeDefined(); // Checking if it is returing an id.
  });
  
  // Getting all the items present in the cart
  it('should GET all the items present in the /api/cart', async () => {
    
    const res = await request(app)
      .get('/api/cart')
      .expect(200);
    
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('total');
    
    // Checking the calculations
    expect(res.body.items[0].name).toBe('Vintage T-Shirt');
    expect(res.body.items[0].quantity).toBe(2);
    expect(res.body.total).toBe(442000);
  })
})