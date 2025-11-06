
import { useContext } from "react";

import { createContext } from "react";

export const CartContext = createContext();

// Creating a custom hook
export const useCart = () => {
  return useContext(CartContext);
}


