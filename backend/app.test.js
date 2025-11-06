// Importing Supertest for making http requests
const request = require('supertest');

const { app, db, initializeDatabase } = require('./app');

// To clean the test database after the testing
const fs = require('fs');

const testDbFile = './ecomstore.test.db';

// This runs ONCE before all tests to wait for the DB seeding operation
beforeAll(async () => {
  await initializeDatabase();
})

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
    expect(res.body.length).toBe(5);
    
    // Checking our Fake Store API data is in response or not
    expect(res.body[0].name).toBe('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops');
    expect(res.body[0].price).toBe(10995);
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
    expect(res.body.items[0].name).toBe('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops');
    expect(res.body.items[0].quantity).toBe(2);
    expect(res.body.total).toBe(21990); // Total = 2 * 10995
  });
  
  // Deleting an item from the cart
  it('should DELETE an item from the cart', async () => {
    
    const res = await request(app)
      .delete('/api/cart/1')
      .expect(200);
    
    expect(res.body.message).toBe('Item removed');
  });
  
  // Should not allow checkout with an empty cart
  it('should not allow checkout with an empty cart', async () => {
    
    const res = await request(app)
      .post('/api/checkout')
      .send()
      .expect(400);
    
    expect(res.body.error).toBe('Cart is empty');
  })
  
  // Checking the POST for checkout and checking if we are receiving the mock receipt
  it('should POST to checkout with items in cart, return mock receipt', async () => {
    
    // Adding noise-cancelling headphones
    await request(app)
      .post('/api/cart').send({ productId: 2, quantity: 1 });
    
    const res = await request(app)
      .post('/api/checkout')
      .send()
      .expect(200);
    
    expect(res.body.total).toBe(2230);
    expect(res.body).toHaveProperty('timestamp');
    
    // Checking if the cart is being emptied after generating receipt
    const cart = await request(app).get('/api/cart').expect(200);
    expect(cart.body.items.length).toBe(0);
  })
});