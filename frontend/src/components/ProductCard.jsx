import React from 'react';
import { useCart } from '../context/CartContext';

// This function formats the price from paisa
const formatPrice = (priceInPaisa) => {
  const priceInRs = priceInPaisa / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(priceInRs);
};

export function ProductCard({ product }) {
  
  const { addToCart } = useCart();

  return (
    <div className="border border-gray-200 rounded-lg bg-white flex flex-col h-full transition hover:border-gray-300">
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
    
        <button
          onClick={() => addToCart(product.id)}
          className="mt-4 w-full px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}