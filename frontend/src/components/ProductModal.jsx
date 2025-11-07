import React from 'react';
import { useCart } from '../context/CartContext';
import formatPrice from '../helper';
import { X } from 'lucide-react';

const ProductModal = () => {
  const { selectedProduct, closeProductModal, addToCart } = useCart();

  if (!selectedProduct) {
    return null;
  }

  const handleAddToCart = () => {
    addToCart(selectedProduct.id);
    closeProductModal(); // Close modal after adding to cart
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={closeProductModal}
    >
      {/* Modal Panel */}
      <div
        className="relative w-full max-w-3xl p-6 bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeProductModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
        >
          <X size={20} />
        </button>
  
        {/* Modal Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="md:w-1/2 h-64 p-4 bg-gray-300 rounded-xl flex items-center justify-center">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="object-contain h-full w-full"
            />
          </div>
  
          {/* Details */}
          <div className="md:w-1/2 flex flex-col justify-between text-white">
            <div className="space-y-4">
              <h2 className="text-2xl text-black font-bold">{selectedProduct.name}</h2>
              <p className="text-gray-500 text-sm md:text-base">
                {selectedProduct.description}
              </p>
  
              <span className="text-3xl font-bold text-cyan-400">
                {formatPrice(selectedProduct.price)}
              </span>
            </div>
  
            <button
              onClick={handleAddToCart}
              className="mt-6 w-full px-4 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-500 transition-colors shadow-md cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;