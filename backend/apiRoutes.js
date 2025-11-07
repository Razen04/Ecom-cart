// Importing necessary libraries required for the project
// Express for the server
const express = require("express");
const { db } = require('./db');
const router = express.Router();

// API Endpoints
/**
 * @route   GET /api/products
 * @desc    Get all mock products from the database
 */
router.get("/products", (req, res) => {
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
router.post("/cart", (req, res) => {
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

router.get("/cart", (req, res) => {
  // Using JOIN to get the name and price from the products table
  const sql = `
      SELECT
        c.id,
        c.quantity,
        p.id AS productId,
        p.name,
        p.price,
        p.image
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
router.delete("/cart/:id", (req, res) => {
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
 * @route   PATCH /api/cart/:id
 * @desc    Increment or decrement the item quantity in the cart
 * @params  id (the cart id, not the product id)
 * @body    { change: number } — positive to increase, negative to decrease
 */

router.patch("/cart/update/:id", (req, res) => {
  const { id } = req.params;
  const { change } = req.body;

  if (typeof change !== "number" || change === 0) {
    return res.status(400).json({ error: "Invalid change value." });
  }

  // We will ensure the quantity never goes below 0
  const getSql = "SELECT quantity FROM cart WHERE id = ?";

  db.get(getSql, [id], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Database error." });
    }

    if (!row) {
      return res.status(404).json({ error: "Item not found in cart." });
    }

    const newQuantity = row.quantity + change;

    // If quantity becomes zero or less we will remove the item
    if (newQuantity <= 0) {
      const deleteSql = "DELETE FROM cart WHERE id = ?";
      db.run(deleteSql, [id], function (err) {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: "Failed to remove item." });
        }
        return res.status(200).json({ message: "Item removed from cart." });
      });
      return;
    }

    // Otherwise we will update the quantity
    const updateSql = "UPDATE cart SET quantity = quantity + ? WHERE id = ?";
    db.run(updateSql, [change, id], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to update quantity." });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Item not found." });
      }

      res.status(200).json({ message: "Cart item updated successfully." });
    });
  });
});


/**
 * @route   POST /api/checkout
 * @desc    Process the checkout
 */
router.post("/checkout", (req, res) => {
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

module.exports = router;