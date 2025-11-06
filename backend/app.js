// Importing necessary libraries required for the project
// Express for the server
const express = require("express");

// SQLite for the database
const sqlite3 = require("sqlite3").verbose();

// CORS is to connect the frontend to backend
const cors = require("cors");

// Axios to fetch products from Fake Store API
const axios = require('axios');

// App & Database setup
const app = express();

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

// Middlewares (Might shift to their own middleware/ folder if deemed necessary)
app.use(cors()); // Allows requests from our frontend
app.use(express.json()); // Parses incoming JSON payloads from frontend

// API Endpoints
/**
 * @route   GET /api/products
 * @desc    Get all mock products from the database
 */
app.get("/api/products", (req, res) => {
  const sql = "SELECT * FROM products";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Return all the products present in the database
    res.json(rows);
  });
});

/**
 * @route   POST /api/cart
 * @desc    Add a prodcut to the cart
 * @body    {productId: 1, quantity: 1}
 */
app.post("/api/cart", (req, res) => {
  // getting the productId and quantity from the request
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({
      error: "Invalid input: productId and a positve quantiy is required.",
    });
  }

  // Checking if the item is already in the Cart
  const checkSql = "SELECT * FROM cart WHERE productId = ?";

  db.get(checkSql, [productId], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Database error" });
    }

    // If the item is already in the cart we just increase the quantity
    if (row) {
      const newQuantity = row.quantity + quantity;
      const updateSql = "UPDATE cart SET quantity = ? WHERE productId = ?";

      db.run(updateSql, [newQuantity, productId], function (err) {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: "Failed to update cart." });
        }

        res.status(200).json({ message: "Cart updated", id: this.lastID });
      });
    } else {
      // Item is not in the cart
      const insertSql = "INSERT INTO cart (productId, quantity) VALUES (?, ?)";

      db.run(insertSql, [productId, quantity], function (err) {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: "Failed to update the cart" });
        }

        res
          .status(201)
          .json({ message: "Item added to the cart", id: this.lastID });
      });
    }
  });
});

/**
 * @route   GET /api/cart
 * @desc    Get all the cart items
 */

app.get("/api/cart", (req, res) => {
  // Using JOIN to get the name and price from the products table
  const sql = `
      SELECT
        c.id,
        c.quantity,
        p.id AS productId,
        p.name,
        p.price
      FROM cart c
      JOIN products p ON c.productId = p.id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Calculating the total price of the cart by accumulating price
    const total = rows.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    res.json({
      items: rows,
      total: total, // The total is in paisa and need to be converted in Rs in frontend
    });
  });
});

/**
 * @route   DELETE /api/cart/:id
 * @desc    Delete an item from the cart
 * @params  id (the cart id and not the product id)
 */
app.delete("/api/cart/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM cart WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Failed to remove items" });
    }

    // this.changes returns how many rows were affected
    if (this.changes === 0) {
      return res.status(404).json({ error: "Item not found in cart." });
    }

    res.status(200).json({ message: "Item removed" });
  });
});

/**
 * @route   POST /api/checkout
 * @desc    Process the checkout
 */
app.post("/api/checkout", (req, res) => {
  const getCartSql = `
      SELECT p.price, c.quantity
      FROM cart c
      JOIN products p ON c.productId = p.id
    `;
  
  db.all(getCartSql, [], (err, rows) => {
    if(err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Internal database error' });
    }
    
    if(rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // We get the total from the database
    const total = rows.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0);
    
    // Creating a mock receipt
    const receipt = {
      total: total,
      timestamp: new Date().toISOString()
    };
    
    // Clearing the cart after receipt generation
    const deleteCartSql = "DELETE FROM cart";
    
    db.run(deleteCartSql, [], (err) => {
      if(err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Failed to clear cart after checkout.' });
      }
      
      res.status(200).json(receipt);
    })
  })
});

module.exports = { app, db, initializeDatabase };
