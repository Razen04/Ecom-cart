// Importing necessary libraries required for the project
// Express for the server
const express = require('express');

// SQLite for the database
const sqlite3 = require('sqlite3').verbose();

// CORS is to connect the frontend to backend
const cors = require('cors');

// App & Database setup
const app = express();
const PORT = process.env.PORT || 5000;

// Connecting to the SQLite database.
// This will create a file named 'ecomstore.db'.
const db = new sqlite3.Database('./ecomstore.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Successfully connected to the ecomestore SQLite database.');
});

// Middlewares (Might shift to their own middleware/ folder if deemed necessary)
app.use(cors()); // Allows requests from our frontend
app.use(express.json()); // Parses incoming JSON payloads from frontend

// Database Schema Setup
// It creates our tables if they don't already exist.
db.serialize(() => {
  // Creating Products Table
  // Prices are stores in paisa. 1 Rs = 100 paisa.
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price INTEGER NOT NULL
    )
  `, (err) => {
    if (err) console.error("Error creating products table:", err.message);
  });

  // Creating Cart Table
  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (productId) REFERENCES products(id)
    )
  `, (err) => {
    if (err) console.error("Error creating cart table:", err.message);
  });

  // Seeding Mock Products for testing
  const mockProducts = [
    { name: 'Vintage T-Shirt', price: 221000 },
    { name: 'Noise-Cancelling Headphones', price: 1275000 },
    { name: 'Coffee Mug', price: 10200 },
    { name: 'Leather Notebook', price: 170000 },
    { name: 'Wireless Mouse', price: 382500 }
  ];

  const stmt = db.prepare("INSERT INTO products (name, price) VALUES (?, ?)");
  
  // Checking if products table is empty before inserting
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
      console.log("Seeding mock products into the database...");
      mockProducts.forEach(product => {
        stmt.run(product.name, product.price);
      });
      console.log("Mock products seeded into the database.");
    } else {
      console.log("Products table already populated in the database.");
    }
    stmt.finalize();
  });
});

// --- API Endpoints ---

// Your API endpoints will go here...
// For example: app.get('/api/products', ...);


// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});