import React from "react";
import { useCart } from "../context/CartContext";
import formatPrice from "../helper";
import { Plus, Minus } from "lucide-react";

const ProductCard = ({ product }) => {
  const { updateQuantity, cartItems, addToCart } = useCart();

  const cartItem = cartItems.find((item) => item.productId === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleIncrease = () => updateQuantity(cartItem.id, 1);
  const handleDecrease = () => updateQuantity(cartItem.id, -1);

  return (
      <div className="border border-gray-200 rounded-xl bg-white flex flex-col h-full transition hover:shadow-sm">
        {/* Product Image */}
        <div className="w-full h-48 flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            className="object-contain h-full w-full"
          />
        </div>
  
        {/* Product Info */}
        <div className="p-4 flex flex-col grow">
          <h2
            className="text-base font-medium text-gray-900 truncate"
            title={product.name}
          >
            {product.name}
          </h2>
  
          <p className="text-sm text-gray-500 mt-1 grow">
            {product.description.substring(0, 80)}...
          </p>
  
          <div className="flex justify-between items-center mt-3">
            <span className="text-lg font-semibold text-gray-800">
              {formatPrice(product.price)}
            </span>
          </div>
  
          {/* Quantity Controls */}
          {quantity > 0 ? (
            <div className="mt-4 flex items-center justify-between border border-gray-300 rounded-lg">
              <button
                onClick={handleDecrease}
                className="w-10 h-9 text-gray-700 text-lg font-medium hover:bg-gray-100 rounded-l-lg flex justify-center items-center cursor-pointer"
              >
                <Minus size={20} />
              </button>
              <span className="w-10 text-center text-gray-800 font-medium">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-10 h-9 text-gray-700 text-lg font-medium hover:bg-gray-100 rounded-r-lg flex justify-center items-center cursor-pointer"
              >
                <Plus size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product.id)}
              className="mt-4 w-full px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    );
}

export default ProductCard;