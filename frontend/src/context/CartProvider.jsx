import { useEffect, useState, useCallback } from "react";
import { CartContext } from "./CartContext";

import axios from "axios";

// CartProvider component
export const CartProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetching the cart and updating the total
  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get("/api/cart");
      setCartItems(res.data.items);
      setCartTotal(res.data.total);
    } catch (err) {
      console.error("Failed to fetch the cart: ", err);
      setError("Failed to fetch cart.");
    }
  }, []);

  // Fetching all the products

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch the products: ", err);
      setError("Failed to fetch the products");
    }
  }, []);

  // Loading the Cart and Product details on initial mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      try {
        await fetchProducts();
        await fetchCart();
      } catch (err) {
        console.error("Failed to load data: ", err);
        setError("Failed to load initial data.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [fetchProducts, fetchCart]);

  // Function to add an item to the cart
  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      try {
        await axios.post("/api/cart", { productId, quantity });

        await fetchCart(); // Fetching cart to update it.
      } catch (err) {
        console.error("Failed to add item in the cart", err);
      }
    },
    [fetchCart],
  );

  // Function to delete an item from the cart
  const removeFromCart = useCallback(
    async (cartItemId) => {
      try {
        await axios.delete(`/api/cart/${cartItemId}`);

        // After removing, updating the cart.
        await fetchCart();
      } catch (err) {
        console.error("Failed to remove from cart: ", err);
      }
    },
    [fetchCart],
  );

  // Checkout function
  const checkout = useCallback(async () => {
    try {
      const res = await axios.post("/api/checkout");
      setReceipt(res.data);
      setIsReceiptOpen(true);
      setIsCartOpen(false);
      await fetchCart(); // Cart will be empty after checkout
    } catch (err) {
      console.error("Checkout failed: ", err);
    }
  }, [fetchCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const closeReceipt = () => {
    setIsReceiptOpen(false);
    setReceipt(null);
  };

  const value = {
    products,
    cartItems,
    cartTotal,
    isCartOpen,
    isReceiptOpen,
    receipt,
    loading,
    error,
    addToCart,
    removeFromCart,
    checkout,
    openCart,
    closeCart,
    closeReceipt,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
