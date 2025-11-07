import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Plus, Minus } from "lucide-react";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const handleIncrease = (id) => updateQuantity(id, 1);
  const handleDecrease = (id) => updateQuantity(id, -1);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      
      
      {/* Product Image */}
      <div className="flex items-center gap-4 flex-1 mb-2 md:mb-0">
        
        <div className="h-16 w-16 shrink-0">
          
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-contain rounded-md border border-gray-200 bg-white"
          />
          
        </div>
    
        {/* Product Info */}
        <div>
          
          <p className="font-medium text-sm mdtext-lg text-gray-900">{item.name}</p>
          <p className="text-gray-500 text-xs md:text-sm mt-0.5">₹{(item.price / 100).toFixed(2)}</p>
        </div>
      </div>
    
      {/* Quantity + Remove Section */}
      <div className="flex items-center gap-2 md:gap-3">
        
        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => handleDecrease(item.id)}
            className="w-7 h-7 md:w-8 md:h-8 flex justify-center items-center text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-gray-800 font-medium">
            {item.quantity}
          </span>
          <button
            onClick={() => handleIncrease(item.id)}
            className="w-8 h-8 flex justify-center items-center text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
    
        {/* Remove Button */}
        
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
