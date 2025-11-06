// SQLite for the database
const sqlite3 = require("sqlite3").verbose();

const axios = require('axios');

// defining the dbFile for both testing and production environment
const dbFile =
  process.env.NODE_ENV === "test" ? "./ecomstore.test.db" : "./ecomstore.db";

// Connecting to the SQLite database.
// This will create a file named 'ecomstore.db'.
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log(`Successfully connected to the ${dbFile} SQLite database.`);
});

// initializeDatabase function: this will initialialize the database
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Database Schema Setup
    // It creates our tables if they don't already exist.
    db.serialize(() => {
      // Creating Products Table
      // Prices are stores in paisa. 1 Rs = 100 paisa.
      db.run(
        `
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price INTEGER NOT NULL,
          description TEXT,
          image TEXT
        )
      `,
        (err) => {
          if (err) return reject(err);
        },
      );
    
      // Creating Cart Table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS cart (
          id INTEGER PRIMARY KEY,
          productId INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          FOREIGN KEY (productId) REFERENCES products(id)
        )
      `,
        (err) => {
          if (err) return reject(err);
        },
      );
    
      const stmt = db.prepare("INSERT INTO products (id, name, price, description, image) VALUES (?, ?, ?, ?, ?)");
    
      // Checking if products table is empty before inserting
      db.get("SELECT COUNT(*) as count FROM products", async (err, row) => {
        if (err) return reject(err);
        
        if (row.count === 0) {
          console.log("Seeding mock products from the Fake Store API into the database...");
          
          try {
            const res = await axios.get('https://fakestoreapi.com/products')
            
            // Begin transaction
            db.run("BEGIN TRANSACTION");
            
            const products = res.data;

            products.forEach(product => {
              // Converting price to paisa
              const priceInPaisa = Math.round(product.price * 100);
                
              stmt.run(
                product.id,
                product.title,
                priceInPaisa,
                product.description,
                product.image,
              )
            })
            
            stmt.finalize();
            
            db.run("COMMIT", (err) => {
              if (err) return reject(err);
              
              console.log("Mock products seeded into the database.");
              resolve();
            })
          } catch (err) {
            return reject(err);
          }
        } else {
          console.log("Products table already populated in the database.");
          resolve();
        }
      });
    });
  })
}

module.exports = { db, initializeDatabase };