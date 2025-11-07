
import { ShoppingBag } from 'lucide-react'; 
import { useCart } from '../context/CartContext';

const Header = () => {

    
  const { openCart, cartItems } = useCart();
  
  const cartItemCount = cartItems.length;

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
          Ecom<span className="text-cyan-500">Cart</span>
        </h1>
    
        <button
          onClick={openCart}
          className="relative flex items-center gap-2 text-gray-700 hover:text-cyan-600 transition-colors cursor-pointer"
        >
          {/* Cart Icon */}
          <ShoppingBag size={15} />
          <span className="text-sm font-medium">Cart</span>
    
          {/* Cart Badge */}
          {cartItemCount >= 0 && (
            <span className="absolute -top-1 -right-2 bg-cyan-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;